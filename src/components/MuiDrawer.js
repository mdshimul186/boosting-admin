import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  list: {
    width: 450,
  },
  fullList: {
    width: 'auto',
  },
  fileLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100px",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "5px"
  },
  imageSize: {
    height: "100px",
    width: "100px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    objectFit: "contain",
    margin: "0 5px"
  },
  imageContainer: {
    display: "flex",
    justifyContent: "ceneter",
    alignItems: "ceneter"
  }
});

export default function MuiDrawer({ isOpen, setIsOpen, selecetedProduct, toggleDrawer, sendProduct ,sendEditedProduct}) {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(false)



  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [SKU, setSKU] = useState("")
  const [VAT, setVAT] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [selectedImages, setSelectedImages] = useState([])

  const [isEdit, setIsEdit] = useState(false)



  const handleCatChange=(e)=>{
    setCategory(e.target.value)
    let selected = categories.filter(cat=>cat._id === e.target.value)
    setSubCategories(selected[0].children ||[])
    setSubCategory('')
  }


  const handleSetCat =(cate)=>{
    console.log(cate)
    if(cate && cate.parentId){
      setCategory(cate.parentId)
      let selected = categories.filter(cat=>cat._id === cate.parentId)
      console.log(selected[0])
        setSubCategories(selected[0].children)
        setSubCategory(cate._id)
    }else{
      setCategory('')
      setSubCategory('')
    }
   
  }


  useEffect(() => {
    if (selecetedProduct) {
      setIsEdit(selecetedProduct._id)
      setTitle(selecetedProduct.title)
      setShortDescription(selecetedProduct.shortDescription)
      setDescription(selecetedProduct.description)
      setPrice(selecetedProduct.price)
      setSKU(selecetedProduct.SKU)
      setVAT(selecetedProduct.VAT)
      setCategory(selecetedProduct.category?._id||'')
      handleSetCat(selecetedProduct.category)
      
    } else {
      setIsEdit(false)
      setTitle('')
      setShortDescription('')
      setDescription('')
      setPrice('')
      setSKU('')
      setVAT('')
      setCategory('')
      setSubCategory('')
    }

  }, [selecetedProduct])




  useEffect(() => {
    axios.get("/product/category")
      .then(res => {
        setCategories(res.data.category)
      })
  }, [])

  const handleSave = () => {
    if(title === '' || price === '' || selectedImages.length === 0 || SKU === '' || VAT === '' || subCategory === ''){
      return alert('please fill all the fields')
    }
    setLoading(true)
    let formData = new FormData()
    formData.append("title", title)
    formData.append("shortDescription", shortDescription)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("VAT", VAT)
    formData.append("SKU", SKU)
    selectedImages.map(img=>{
      formData.append("productImg", img)
    })
    
    formData.append("category", subCategory)

    axios.post('/product/create', formData)
      .then(res => {
        sendProduct(res.data.product)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        err && err.response && alert(err.response.data.error)
      })
  }

  const handleEdit=(id)=>{
    console.log(subCategory)
    if(title === '' || price === ''|| SKU === '' || VAT === '' || !subCategory){
      return alert('please fill all the fields')
    }
    setLoading(true)
    let data={
      title,
      shortDescription,
      description,
      price,
      VAT,
      SKU,
      category:subCategory
    }
    axios.patch('/product/edit/'+id,data)
    .then(res => {
      sendEditedProduct(res.data.product)
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
      err && err.response && alert(err.response.data.error)
    })

  }



  return (
    <div>

      <React.Fragment>
        <Drawer anchor='right' open={isOpen} onClose={toggleDrawer('right', false)}>

          <Box component="span" m={3}>
            <div style={{ width: "50vw" }}>
              <Typography variant="h3" gutterBottom>
                {isEdit ? "Edit Product" : "Add Product"}
              </Typography>
              
              <Grid container spacing={3}>
              {
                !isEdit && (
                  <Grid item xs={12}>
                  <InputLabel style={{ marginBottom: "10px" }} id="demo-simple-select-label">Select Images</InputLabel>
                  <div className={classes.imageContainer}>
                    {
                      selectedImages.length > 0 && selectedImages.map((img, index) => {
                        return (
                          <img className={classes.imageSize} key={index} src={URL.createObjectURL(img)}></img>
                        )
                      })
                    }
                    <label className={classes.fileLabel} htmlFor='serviceimage'><AddIcon /></label>

                    <input onChange={(e) => setSelectedImages([...selectedImages, e.target.files[0]])} id='serviceimage' type='file' accept='image/*' hidden></input>
                  </div>
                </Grid>
                )
              }
                
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Service Title"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="shortDescription"
                    name="shortDescription"
                    label="Short Description"
                    multiline
                    rowsMax={2}
                    fullWidth
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="description"
                    name="description"
                    label="Service Description"
                    multiline
                    rowsMax={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="price"
                    name="price"
                    label="Service Price"
                    type='number'
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="sku"
                    name="sku"
                    label="SKU"
                    fullWidth
                    value={SKU}
                    onChange={(e) => setSKU(e.target.value)}

                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="vat"
                    name="vat"
                    label="VAT"
                    type='number'
                    fullWidth
                    autoComplete="Enter VAT"
                    value={VAT}
                    onChange={(e) => setVAT(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={(e) => handleCatChange(e)}
                    fullWidth
                  >
                    {
                      categories.map((cat, index) => {
                        return <MenuItem key={index} value={cat._id}>{cat.name}</MenuItem>
                      })
                    }


                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="demo-simple-select-label">Select sub Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    fullWidth
                  >
                    {
                      subCategories && subCategories.map((cat, index) => {
                        return <MenuItem key={index} value={cat._id}>{cat.name}</MenuItem>
                      })
                    }


                  </Select>
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                    label="Use this address for payment details"
                  />
                </Grid> */}
                <Grid item xs={12}>
                {
                  isEdit ? <Button onClick={() => handleEdit(isEdit)} variant="contained" color="primary">
                    Edit
                  </Button>:
                  <Button onClick={() => handleSave()} variant="contained" color="primary">
                    save
                  </Button>
                }
                  
                  <Button onClick={() => setIsOpen(false)} style={{ marginLeft: "15px" }} variant="contained" color="default">
                    Cancle
                </Button>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Drawer>
      </React.Fragment>
      <Backdrop style={{ zIndex: "999999" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
