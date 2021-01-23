import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Page from 'src/components/Page';

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';


import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';



import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import AddIcon from '@material-ui/icons/Add';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  catContainer: {
    width: "500px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 20px"
  }
}));

const ServiceLayout = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)


  const [Options, setOptions] = useState([])
  const [name, setName] = useState("")
  const [edit, setEdit] = useState(null)
  const [parent, setParent] = useState(null)
  const [products, setProducts] = useState([])
  const [mainCategories, setMainCategories] = useState([])



  const [category, setCategory] = useState(null)
  const [p1, setP1] = useState(null)
  const [p2, setP2] = useState(null)
  const [p3, setP3] = useState(null)
  const [p4, setP4] = useState(null)
  const [position, setPosition] = useState(0)

  

  const fetchCategories = () => {
    setLoading(true)
    axios.get("/setting/getsetting")
      .then(res => {
        setLoading(false)
        var sorted = res.data.setting.serviceOptions.sort((a,b)=>{
          return parseInt(a.position) - parseInt(b.position)
        })
        setOptions(sorted)
      })
  }
  const fetchAllProducts = () => {
    setLoading(true)
    axios.get("/product/allproducts")
      .then(res => {
        setLoading(false)
        setProducts(res.data.product)
  
      })
    }
    

    const fetchMainCategories = () => {
      setLoading(true)
      axios.get("/product/category")
        .then(res => {
          setLoading(false)
          setMainCategories(res.data.category)
        })
    }

  useEffect(() => {
    fetchCategories()
    fetchAllProducts()
    fetchMainCategories()
  }, [])




  const handleClickOpen = (cat) => {
   
    setParent(cat||null)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null)
    setCategory(null)
    setP1(null)
    setP2(null)
    setP3(null)
    setP4(null)
    setPosition(0)
    
  };

  const handleEdit = (opt) => {
    setEdit(opt._id)
    setCategory(opt.category)
    setP1(opt.product[0])
    setP2(opt.product[1])
    setP3(opt.product[2])
    setP4(opt.product[3])
    setPosition(opt.position)
    handleClickOpen()
  }

  const handleAdd = () => {
    let data = {
      category:category._id,
      position,
      p1:p1._id,
      p2:p2._id,
      p3:p3._id,
      p4:p4._id,
    }

   
    if(!data.category || !data.position || !data.p1 || !data.p2 || !data.p3 || !data.p4){
     return alert("all fields are required")
    }
    setLoading(true)
    axios.post('/setting/addcategory', data)
      .then(res => {
        if (res.data.success) {
          // setCategories([...categories, res.data.category])
          fetchCategories()
          setLoading(false)
          handleClose()
        }
      })
      .catch(err => {
        setLoading(false)
        err && err.response && alert(err.response.data.error)
      })
  }

  const handleSaveEdit = (id) => {
    let data = {
      category:category._id,
      position,
      p1:p1._id,
      p2:p2._id,
      p3:p3._id,
      p4:p4._id,
    }

   
    if(!data.category || !data.position || !data.p1 || !data.p2 || !data.p3 || !data.p4){
     return alert("all fields are required")
    }
    setLoading(true)
    axios.patch('/setting/update/'+id, data)
      .then(res => {
        if (res.data.success) {
          // setCategories([...categories, res.data.category])
          fetchCategories()
          setLoading(false)
          handleClose()
        }
      })
      .catch(err => {
        setLoading(false)
        err && err.response && alert(err.response.data.error)
      })

  }

  const handleDelete = (opt) => {
    let consent = window.confirm('Are you sure')
    if (!consent) return
    axios.patch('/setting/remove/' + opt._id)
      .then(res => {
        if (res.data.success) {
          // let temp = [...categories]
          // let index = temp.findIndex(c => c._id === id)
          // temp.splice(index, 1)
          // setCategories(temp)
          fetchCategories()
          handleClose()
        }
      })
      .catch(err => {
        err && err.response && alert(err.response.data.error)
      })
  }

  

  return (
    <>


      <div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"

        >
          <DialogTitle id="alert-dialog-title">Add {parent && "Sub"} Category</DialogTitle>
          <DialogContent>
          <div>
          {
            parent && <span><strong>Parent:</strong>{parent.name}</span>
          }
          </div>
          
          <div style={{width:"500px",height:"400px"}}>
         
        

          <TextField 
          type='number'
          value={position}
          onChange={(e)=>setPosition(e.target.value)}
          label="Enter category position" 
          style={{width:"100%",margin:"10px 0"}}
          variant="outlined" />
        <Autocomplete
        value={category}
        getOptionLabel={(cat) => cat.name}
        id="category"
        options={mainCategories}
        onChange={(event, newValue) => {
          setCategory(newValue)
        }}  
        renderInput={(params) => <TextField {...params} label="Select category" variant="outlined" />}
        style={{width:"100%",margin:"10px 0"}}
      />
        <Autocomplete
        value={p1}
        getOptionLabel={(products) => products.title}
        id="p1"
        options={products}
        onChange={(event, newValue) => {
          setP1(newValue)
        }}  
        renderInput={(params) => <TextField {...params} label="Select service 1" variant="outlined" />}
        style={{width:"100%",margin:"10px 0"}}
      />
        <Autocomplete
        value={p2}
        getOptionLabel={(products) => products.title}
        id="p2"
        options={products}
        onChange={(event, newValue) => {
          setP2(newValue)
        }}  
        renderInput={(params) => <TextField {...params} label="Select service 2" variant="outlined" />}
        style={{width:"100%",margin:"10px 0"}}
      />
        <Autocomplete
        value={p3}
        getOptionLabel={(products) => products.title}
        id="p3"
        options={products}
        onChange={(event, newValue) => {
          setP3(newValue)
        }}  
        renderInput={(params) => <TextField {...params} label="Select service 3" variant="outlined" />}
        style={{width:"100%",margin:"10px 0"}}
      />
        <Autocomplete
        value={p4}
        getOptionLabel={(products) => products.title}
        id="p4"
        options={products}
        onChange={(event, newValue) => {
          setP4(newValue)
        }}  
        renderInput={(params) => <TextField {...params} label="Select service 4" variant="outlined" />}
        style={{width:"100%",margin:"10px 0"}}
      />

          </div>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancle
          </Button>
            {
              edit ? <Button onClick={() => handleSaveEdit(edit)} color="primary" autoFocus>
                Edit
          </Button> :
                <Button onClick={() => handleAdd()} color="primary" autoFocus>
                  Add
          </Button>
            }

          </DialogActions>
        </Dialog>
      </div>






      <Page
        className={classes.root}
        title="Categories"
      >

        <Container maxWidth={false}>
          <div>
            <Box display="flex" justifyContent="flex-end" >
              <Button
                color="primary"
                variant="contained"
                onClick={() => handleClickOpen()}
              >
                Add Category section
        </Button>
            </Box>

          </div>
          <Box style={{ background: "white", padding: "30px" }} mt={3}>
            {/* {
              categories.length > 0 ? categories.map((cat, index) => {
                return (
                  <div className={classes.catContainer} key={index}>
                    <Typography variant='subtitle2'>{cat.name}</Typography>
                    <div>
                      <IconButton onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                      <IconButton onClick={()=>handleDelete(cat._id)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                    </div>
                  </div>
                )
              }) :
                <p>No categories found</p>
            } */}







            <TreeView

              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >

              {
                Options.length > 0 ? Options.map((opt, index) => {
                  return (

                    <TreeItem
                      key={index}
                      nodeId={opt._id}
                      label={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {opt.category.name} <span>position:<strong>{opt.position}</strong></span>
                          <div>
                            <IconButton onClick={() => handleEdit(opt)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(opt)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                          </div>
                        </div>
                      }>
                      {
                        opt.product.length > 0 && opt.product.map(product => {
                          return (
                            <TreeItem
                              key={product._id}
                              nodeId={product._id}
                              label={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <span>{product.title}</span>
                                  <span style={{marginLeft:"20px"}}>price:<strong> {product.price} BDT</strong></span>
                                  
                                </div>
                              }

                            />
                          )
                        })
                      }


                    </TreeItem>

                  )
                }) :
                  <p>No categories found</p>
              }

            </TreeView>




          </Box>
        </Container>
      </Page>
      <Backdrop style={{ zIndex: "999999" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ServiceLayout;
