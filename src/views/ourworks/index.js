import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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

import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';

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
    thumbnail: {
        height: "100px", width: "200px", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px", fontWeight: "bold", margin: "20px", cursor: "pointer", backgroundSize: "cover"
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
}));


const headCells = [
    { id: 'thumbnail', label: 'Thumbnail', disableSorting: true },
    { id: 'category', label: 'Category', disableSorting: true },
    { id: 'shortDescription', label: 'Short Description', disableSorting: true },
    { id: 'date', label: 'Date', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

const OurWorks = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)


    const [selectedImages, setSelectedImages] = useState([])
    const [portfolioImages, setPortfolioImages] = useState(null)
    const [shortDescription, setShortDescription] = useState('')
    const [longDescription, setLongDescription] = useState('')
    const [category, setCategory] = useState('')
    const [selectedPortfolio, setSelectedPortfolio] = useState(null)

    const [changeImage, setChangeImage] = useState(true)


    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);



    useEffect(() => {
        setLoading(true)
        axios.get('/portfolio/getall')
            .then(res => {
                setLoading(false)
                setRecords(res.data.portfolio)
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }, [])

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.category.toString().includes(target.value))
            }
        })
    }





    //--------------------delete
    const handleDelete = (id) => {

        let consent = window.confirm("Are you sure ?")
        if (consent) {
            setLoading(true)
            axios.delete('/portfolio/delete/' + id)
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


    //----------create new project




    const handleClickOpen = (portfolio) => {
        setChangeImage(false)
        setSelectedPortfolio(portfolio._id)
        setCategory(portfolio.category)
        setShortDescription(portfolio.shortDescription)
        setLongDescription(portfolio.longDescription)
        setPortfolioImages(portfolio.portfolioImages)
        setOpen(true);

    };

    const handleClose = () => {
        setChangeImage(true)
        setOpen(false);
        setCategory('')
        setShortDescription('')
        setLongDescription('')
        setSelectedImages([])
        setPortfolioImages(null)

    };

    const savePortfolio = () => {
        if(!category || selectedImages.length === 0){
          return alert("Category and images are required")
        }
        setLoading(true)
        let formData = new FormData()
        formData.append('shortDescription',shortDescription)
        formData.append('longDescription',longDescription)
        formData.append('category',category)
        selectedImages.map(img=>{
            formData.append("portfolioImg", img)
          })
   
        axios.post('/portfolio/create', formData)
            .then(res => {
                setLoading(false)
                setRecords([res.data.portfolio, ...records])
                handleClose()
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }
    //---------edit
    const updatePortfolio = (id) => {
        if(!category){
            return alert("Category and images are required")
          }
          if(changeImage){
              if(selectedImages.length === 0){
                return alert("images are required")
              }
          }
          
        setLoading(true)
        let formData = new FormData()
        formData.append('shortDescription',shortDescription)
        formData.append('longDescription',longDescription)
        formData.append('category',category)
        if(changeImage){
            selectedImages.map(img=>{
                formData.append("portfolioImg", img)
              })
        }
        


        axios.patch('/portfolio/edit/' + id, formData)
            .then(res => {
                if (res.data.success) {
                    let temp = [...records]
                    let index = temp.findIndex(portfolio => portfolio._id === id)
                    temp[index] = res.data.portfolio
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
     
            <Container maxWidth={false}>
                <Box display="flex" justifyContent="flex-end" >
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpen(true)}
                    >
                        Add New Project
        </Button>
                </Box>
                <Paper className={classes.pageContent}>

                    <Toolbar>
                        <TextField
                            variant='outlined'
                            label="Enter category"
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
                                    <TableCell><img style={{ height: "50px", width: "75px", objectFit: "contain" }} src={item.portfolioImages[0]}></img></TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.shortDescription}</TableCell>
                                    <TableCell>{moment(item.createdAt).fromNow()}</TableCell>

                                    <TableCell>
                                        <div style={{ display: "flex" }}>
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
                    <DialogTitle id="alert-dialog-title">{selectedPortfolio ? "Update" : "Create"} Portfolio</DialogTitle>
                    <DialogContent style={{ width: "600px" }}>





                        <InputLabel style={{ marginBottom: "10px" }} id="demo-simple-select-outlined-label1">Select category</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label1"
                            id="demo-simple-select-outlined1"
                            fullWidth
                            variant='outlined'
                            style={{ marginBottom: "10px" }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value='design'>Design</MenuItem>
                            <MenuItem value='development'>Development</MenuItem>
                            <MenuItem value='marketing'>Marketing</MenuItem>
                        </Select>


                        <div>
                            <InputLabel style={{ marginBottom: "10px" }} id="demo-simple-select-label">
                            Select Images {portfolioImages &&  <span style={{cursor:"pointer",fontWeight:"bold"}} onClick={()=>setChangeImage(!changeImage)}>{changeImage ? '(cancel)':'(change)'}</span>}
                            </InputLabel>
                            <div className={classes.imageContainer}>
                            {
                                !changeImage && portfolioImages ? portfolioImages.map((img,index)=>{
                                    return(
                                        <img 
                                            className={classes.imageSize} 
                                            key={index} 
                                            src={img}>

                                        </img>
                                    )
                                }):
                                 selectedImages.length > 0 && selectedImages.map((img, index) => {
                                        return (
                                            <img 
                                            className={classes.imageSize} 
                                            key={index} 
                                            src={URL.createObjectURL(img)}>

                                            </img>
                                        )
                                    })

                            }
                                {/* {
                                    selectedImages.length > 0 && selectedImages.map((img, index) => {
                                        return (
                                            <img 
                                            className={classes.imageSize} 
                                            key={index} 
                                            src={URL.createObjectURL(img)}>

                                            </img>
                                        )
                                    })
                                } */}
                                {
                                   changeImage && selectedImages.length < 5 && <label className={classes.fileLabel} htmlFor='serviceimage'><AddIcon /></label>
                                }


                                <input onChange={(e) => setSelectedImages([...selectedImages, e.target.files[0]])} id='serviceimage' type='file' accept='image/*' hidden></input>
                            </div>
                        </div>

                        <TextField
                            style={{ marginTop: "10px" }}
                            fullWidth
                            id="standard-basic"
                            variant='outlined'
                            label="Short Description"
                            placeholder='Enter short description'
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}

                        />
                        <TextField
                            style={{ marginTop: "10px" }}
                            fullWidth
                            id="standard-basic"
                            variant='outlined'
                            label="Long Description"
                            placeholder='Enter long description'
                            value={longDescription}
                            rows={3}
                            onChange={(e) => setLongDescription(e.target.value)}

                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Cancle
                        </Button>
                        {
                            selectedPortfolio ? <Button onClick={() => updatePortfolio(selectedPortfolio)} color="primary">
                                Update
                            </Button> :
                            <Button onClick={() => savePortfolio()} color="primary">
                                Create
                            </Button>

                        }
                    </DialogActions>
                </Dialog>
            </div>



            <Backdrop style={{ zIndex: "999999" }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Page>
    );
};

export default OurWorks
