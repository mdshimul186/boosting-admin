import React, { useState,useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import data from './data';
import axios from 'axios'
import MuiDrawer from '../../../components/MuiDrawer'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const [products, setProducts] = useState([]);
  const [selecetedProduct, setSelectedProduct] = useState(null);
  
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/product/allproducts')
    .then(res=>{
      setProducts(res.data.product)
    })
    
  }, [])

  const handleDrawer=()=>{
    setIsOpen(true)
  }

  const setEdit=(product)=>{
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

  const sendProduct=(product)=>{
    setProducts([product,...products])
    setIsOpen(false);
    setSelectedProduct(false)
  }

  const handleDelete=(id)=>{
    let consent = window.confirm("Are you sure?")
    if(consent){
      axios.delete('/product/delete/'+id)
      .then(res=>{
        if(res.data.success){
          let temp = [...products]
          let index = temp.findIndex(p=>p._id===id)
          temp.splice(index,1)
          setProducts(temp)
          
        }
      })
    }
  }

  const sendEditedProduct=(product)=>{
    let temp = [...products]
    let index = temp.findIndex(p=>p._id===product._id)
    temp[index] = product
    setProducts(temp)
    setIsOpen(false);
    setSelectedProduct(false)
  }

  const sendBulk=(product)=>{
    setProducts([...product,...products])
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
          <Grid
            container
            spacing={3}
          >
            {products.length>0 ? products.map((product) => (
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
            )):
            <p>No products found</p>
            }
          </Grid>
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
