import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Editor } from '@tinymce/tinymce-react';

//import Toolbar from './Toolbar';


import useTable from "../../components/useTable";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Toolbar, Paper, TableBody, TableRow, TableCell, InputAdornment, TextField, IconButton } from '@material-ui/core';
import { Search } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import moment from 'moment'
import Preview from './Preview'
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  searchInput: {
    width: '50%'
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  },
  thumbnail:{
    height: "100px", width: "200px", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px", fontWeight: "bold", margin: "20px" ,cursor:"pointer",backgroundSize:"cover"
  }
}));


const headCells = [
  { id: 'thumbnail', label: 'Thumbnail', disableSorting: true },
  { id: 'title', label: 'Title' },
  { id: 'creator', label: 'Creator' },
  { id: 'date', label: 'Date', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const Articles = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [openPreview, setOpenPreview] = React.useState(false);
  const [status, setStatus] = useState('')

 
  const [selectedPreview, setSelectedPreview] = useState(null)

  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn);



  useEffect(() => {
    axios.get('/article/getall')
    .then(res=>{
      setRecords(res.data.articles)
    })
  }, [])

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value == "")
          return items;
        else
          return items.filter(x => x.title.toString().includes(target.value))
      }
    })
  }




  //---------------preview
  const handlePreview = (article) => {
    setOpenPreview(true)
    setSelectedPreview(article)
  }
  const handleClosePreview = () => {
    setOpenPreview(false)
    setSelectedPreview(null)
  }
  //--------------------delete
  const handleDelete = (id) => {
    
    let consent = window.confirm("Are you sure ?")
    if (consent) {
      setLoading(true)
      axios.delete('/article/delete/' + id)
        .then(res => {
          if (res.data.success) {
            let temp = [...records]
            let index = temp.findIndex(article => article._id === id)
            temp.splice(index, 1)
            setRecords(temp)
            setLoading(false)
          }
        })
        .catch(err => {
          setLoading(false)
          err && err.response && alert(err.response.data.error)
        })
    }
  }


  //----------create new article
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const handleEditorChange = (content, editor) => {
    setDescription(content)
  }

  const handleClickOpen = (article) => {
    console.log(article)
    setTitle(article.title)
    setThumbnail(article.thumbnail)
    setDescription(article.description)
    setTags(article.tags)
    setSelectedArticle(article._id)
    // setStatus(article.isApproved ? 'approve' : 'pending')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('')
    setDescription('')
    setTags('')
    setSelectedImage(null)
    setSelectedArticle(null)
    setThumbnail(null)
  };

  const saveArticle=()=>{
    if(!title || !description || !tags){
      return alert("All fields are required")
    }
    setLoading(true)
    let formData = new FormData()
    formData.append('title',title)
    formData.append('description',description)
    formData.append('thumbnail',selectedImage)
    formData.append('tags',tags)
    axios.post('/article/create',formData)
    .then(res=>{
      setLoading(false)
      setRecords([res.data.article,...records])
      handleClose()
    })
    .catch(err=>{
      setLoading(false)
      err && err.response && alert(err.response.data.error)
    })
  }
  //---------edit
  const updateArticle = (id) => {
    setLoading(true)
    let formData = new FormData()
    formData.append('title',title)
    formData.append('description',description)
    formData.append('thumbnailedit',selectedImage ? selectedImage : null)
    formData.append('tags',tags)


    axios.patch('/article/edit/' + id, formData)
      .then(res => {
        if (res.data.success) {
          let temp = [...records]
          let index = temp.findIndex(article => article._id === id)
          temp[index] = res.data.article
          setRecords(temp)
          handleClose()
          setLoading(false)
        }
      })
      .catch(err => {
        setLoading(false)
        err && err.response && alert(err.response.data.error)
      })
  }


  return (
    <Page
      className={classes.root}
      title="Articles"
    >
      <Preview handleClosePreview={handleClosePreview} open={openPreview} article={selectedPreview} />
      <Container maxWidth={false}>
        <Box display="flex" justifyContent="flex-end" >
          <Button
            color="primary"
            variant="contained"
            onClick={() =>setOpen(true)}
          >
            Add Article
        </Button>
        </Box>
        <Paper className={classes.pageContent}>

          <Toolbar>
            <TextField
              variant='outlined'
              label="Enter article title"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (<InputAdornment position="start">
                  <Search />
                </InputAdornment>)
              }}
              onChange={handleSearch}
            />

          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {
                recordsAfterPagingAndSorting().map((item, index) =>
                (<TableRow key={item._id}>
                  <TableCell><img style={{height:"50px",width:"75px",objectFit:"contain"}} src={item.thumbnail}></img></TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.creator ? item.creator.userName : "N/A"}</TableCell>
                  <TableCell>{moment(item.createdAt).fromNow()}</TableCell>

                  <TableCell>
                    <div style={{ display: "flex" }}>
                      <IconButton
                        color="default"
                        onClick={() => handlePreview(item)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleClickOpen(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item._id)}>
                        <DeleteForeverIcon style={{ color: "red" }} />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>)
                )
              }
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
      </Container>




      <div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth='xl'
        >
          <DialogTitle id="alert-dialog-title">{selectedArticle? "Update" :"Create"} Article</DialogTitle>
          <DialogContent>


            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
              <div style={{ width: "70%" }}>
                <TextField value={title} onChange={(e) => setTitle(e.target.value)} fullWidth id="standard-basic" variant='outlined' label="Enter title" />
              </div>
              <div style={{ width: "30%" }}>
                <div className={classes.thumbnail} style={selectedImage ? { backgroundImage: `url(${URL.createObjectURL(selectedImage)})` } : thumbnail ? { backgroundImage: `url(${thumbnail})` }:null}>
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    name="file"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    id="file" />
                  <label htmlFor="file"><i className="fas fa-upload"></i> Upload Your Image</label>
                </div>
              </div>
            </div>


            <Editor
              initialValue="<p></p>"
              apiKey="91als7opdgzbord7g1svxmwnzu364m2bj3nc5n1wzrzj0hnr"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code imagetools wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | link image media \
										alignleft aligncenter alignright alignjustify | \
										bullist numlist outdent indent | removeformat |',
                automatic_uploads: true,
                relative_urls: false,
                images_upload_url: "/article/articleimages",
                images_upload_handler: function (blobinfo, success, failure) {
                  let headers = new Headers()
                  headers.append('Accept', 'Application/JSON')

                  let formData = new FormData()
                  formData.append("articleimages", blobinfo.blob(), blobinfo.filename())

                  axios.post('/article/articleimages', formData)
                    .then(res => {
                      success(res.data.imgUrl)
                    })
                    .catch(() => failure('http error'))
                }
              }}
              onEditorChange={handleEditorChange}
              value={description}

            />

            <TextField
              style={{ marginTop: "10px" }}
              fullWidth
              id="standard-basic"
              variant='outlined'
              label="Enter tags"
              placeholder='tag1,tag2,tag3...'
              value={tags}
              onChange={(e) => setTags(e.target.value)}

            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancle
          </Button>
          {
            selectedArticle ?<Button onClick={() => updateArticle(selectedArticle)} color="primary">
              Update
          </Button>:
           <Button onClick={() => saveArticle()} color="primary">
              Create
          </Button>
          
          }
          </DialogActions>
        </Dialog>
      </div>



      <Backdrop style={{zIndex:"999999"}} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

export default Articles
