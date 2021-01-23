import {
  Box,
  Container,
  Grid,
  makeStyles,
  Card,
  CardContent,
  TextField,
  SvgIcon,
  InputAdornment,
  
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Page from 'src/components/Page';
import useTable from "../../components/useTable";
import MuiDrawer from './MuiDrawer';
import ProductCard from './ProductCard';
import Toolbar from './Toolbar';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));



const ProductList = () => {
  const classes = useStyles();

  const [selecetedProduct, setSelectedProduct] = useState(null);

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [records, setRecords] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, [], filterFn);

  useEffect(() => {
    setLoading(true)
    axios.get('/product/allproducts')
      .then(res => {
        setRecords(res.data.product)
        setRecordsAll(res.data.product)
        setLoading(false)
      })
      .catch(err=>{
        setLoading(false)
        err && err.response && alert(err.response.data.error)
      })

  }, [])

  const handleDrawer = () => {
    setIsOpen(true)
  }

  const setEdit = (product) => {
    console.log(product)
    setSelectedProduct(product)
    setIsOpen(true)
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(false);
    setSelectedProduct(false)
  };

  const sendProduct = (product) => {
    setRecords([product, ...records])
    setRecordsAll([product, ...recordsAll])
    setIsOpen(false);
    setSelectedProduct(false)
  }

  const handleDelete = (id) => {
    let consent = window.confirm("Are you sure?")
    if (consent) {
      axios.delete('/product/delete/' + id)
        .then(res => {
          if (res.data.success) {
            let temp = [...records]
            let index = temp.findIndex(p => p._id === id)
            temp.splice(index, 1)
            setRecords(temp)
            setRecordsAll(temp)
          }
        })
    }
  }

  const sendEditedProduct = (product) => {
    let temp = [...records]
    let index = temp.findIndex(p => p._id === product._id)
    temp[index] = product
    setRecords(temp)
    setRecordsAll(temp)
    setIsOpen(false);
    setSelectedProduct(false)
  }

  const sendBulk = (product) => {
    setRecordsAll([...product, ...recordsAll])
    setRecords([...product, ...records])
  }
  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value == "")
          return items;
        else
          return items.filter(x => x.title.toString().toLowerCase().includes(target.value.toLowerCase()))
      }
    })
  }

  return (
    <Page
      className={classes.root}
      title="Products"
    >
      <MuiDrawer sendEditedProduct={sendEditedProduct} sendProduct={sendProduct} toggleDrawer={toggleDrawer} selecetedProduct={selecetedProduct} setIsOpen={setIsOpen} isOpen={isOpen} />
      <Container maxWidth={false}>
        <Toolbar sendBulk={sendBulk} handleDrawer={handleDrawer} />
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon
                          fontSize="small"
                          color="action"
                        >
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search product"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {recordsAfterPagingAndSorting().length > 0 ? recordsAfterPagingAndSorting().map((product) => (
              <Grid
                item
                key={product._id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard
                  className={classes.productCard}
                  product={product}
                  setEdit={setEdit}
                  handleDelete={handleDelete}
                />
              </Grid>
            )) :
              <p>No products found</p>
            }
          </Grid>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <TblPagination />
          </div>

        </Box>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          {/* <Pagination
            color="primary"
            count={3}
            size="small"
          /> */}
        </Box>
      </Container>
      <Backdrop style={{ zIndex: "999999" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

export default ProductList;
