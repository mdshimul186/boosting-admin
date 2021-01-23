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
  TextField
} from '@material-ui/core';
import Page from 'src/components/Page';


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

const CaterogyList = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)


  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [edit, setEdit] = useState(null)
  const [parent, setParent] = useState(null)

  const fetchCategories = () => {
    setLoading(true)
    axios.get("/product/category")
      .then(res => {
        setLoading(false)
        setCategories(res.data.category)
      })
  }

  useEffect(() => {
    fetchCategories()
  }, [])




  const handleClickOpen = (cat) => {
   
    setParent(cat||null)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null)
    setParent(null)
    setName('')
  };

  const handleEdit = (cat) => {
    setEdit(cat)
    setName(cat.name)
    handleClickOpen()
  }

  const handleAdd = () => {
    let data = {
      name
    }
    if(parent){
      data.parentId = parent._id
    }
    axios.post('/product/addcategory', data)
      .then(res => {
        if (res.data.success) {
          // setCategories([...categories, res.data.category])
          fetchCategories()
          handleClose()
        }
      })
      .catch(err => {
        err && err.response && alert(err.response.data.error)
      })
  }

  const handleSaveEdit = (cat) => {
    let data = {
      name
    }
    axios.post('/product/editcategory/' + cat._id, data)
      .then(res => {
        if (res.data.success) {
          // let temp = [...categories]
          // let index = temp.findIndex(c => c._id === cat._id)
          // temp[index] = res.data.category
          // setCategories(temp)
          fetchCategories()
          handleClose()
        }
      })
      .catch(err => {
        err && err.response && alert(err.response.data.error)
      })

  }

  const handleDelete = (cat) => {
    if(cat.children.length){
      return alert("Plesae delete sub category first")
    }
    let consent = window.confirm('Are you sure')
    if (!consent) return
    axios.delete('/product/deletecategory/' + cat._id)
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
          
          <div>
          <TextField
              label="Category Name"
              type='text'
              fullWidth
              style={{ width: "300px" }}
              onChange={(e) => setName(e.target.value)}
              value={name}

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
                Add Category
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
                categories.length > 0 ? categories.map((cat, index) => {
                  return (

                    <TreeItem
                      key={index}
                      nodeId={cat._id}
                      label={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {cat.name}
                          <div>
                            <IconButton onClick={() => handleClickOpen(cat)}><AddIcon color='primary' /></IconButton>
                            <IconButton onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(cat)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                          </div>
                        </div>
                      }>
                      {
                        cat.children.length > 0 && cat.children.map(child => {
                          return (
                            <TreeItem
                              key={child._id}
                              nodeId={child._id}
                              label={
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  {child.name}
                                  <div><IconButton onClick={() => handleEdit(child)}><EditIcon /></IconButton><IconButton onClick={() => handleDelete(child)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                                  </div>
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

export default CaterogyList;
