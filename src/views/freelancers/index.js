import {
    Box, Button, Container,
    Divider, FormControl, IconButton, makeStyles, Paper, TableBody, TableCell, TableRow, TextField, Typography
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import Page from 'src/components/Page';
//import Toolbar from './Toolbar';
import useTable from "../../components/useTable";
import styles from './freelancer.module.css';

const headers = [
    { label: "name", key: "name" },
    { label: "gender", key: "gender" },
    { label: "location", key: "location" },
    { label: "skills", key: "skills" },
    { label: "title", key: "title" },
    { label: "experience", key: "experience" },
    { label: "industry", key: "industry" },
    { label: "profile", key: "profile" },
    { label: "phone", key: "contacts.phone" },
    { label: "facebook", key: "contacts.facebook" },
    { label: "skype", key: "contacts.skype" },
    { label: "linkedin", key: "contacts.linkedin" },
    { label: "whatsapp", key: "contacts.whatsapp" },
    { label: "email", key: "contacts.email" },
    { label: "port1-siteName", key: "portfolios[0].siteName" },
    { label: "port1-siteType", key: "portfolios[0].siteType" },
    { label: "port1-siteLink", key: "portfolios[0].siteLink" },
    { label: "port2-siteName", key: "portfolios[1].siteName" },
    { label: "port2-siteType", key: "portfolios[1].siteType" },
    { label: "port2-siteLink", key: "portfolios[1].siteLink" },
    { label: "port3-siteName", key: "portfolios[2].siteName" },
    { label: "port3-siteType", key: "portfolios[2].siteType" },
    { label: "port3-siteLink", key: "portfolios[2].siteLink" },
    { label: "port4-siteName", key: "portfolios[3].siteName" },
    { label: "port4-siteType", key: "portfolios[3].siteType" },
    { label: "port4-siteLink", key: "portfolios[3].siteLink" },
    { label: "port5-siteName", key: "portfolios[4].siteName" },
    { label: "port5-siteType", key: "portfolios[4].siteType" },
    { label: "port5-siteLink", key: "portfolios[4].siteLink" },
  ];
   



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
        height: "120px",
        width: "150px",
        border: "1px solid #ccc",
        cursor: "pointer",
        borderRadius: "5px"
    },
    imageSize: {
        height: "120px",
        width: "150px",
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
    { id: 'name', label: 'Name', disableSorting: true },
    { id: 'skills', label: 'Skills', disableSorting: true },
    { id: 'title', label: 'Title', disableSorting: true },
    { id: 'experience', label: 'Experience', disableSorting: true },
    { id: 'industry', label: 'Industry', disableSorting: true },
    { id: 'phone', label: 'Phone', disableSorting: true },
    { id: 'skype', label: 'Skype', disableSorting: true },
    { id: 'whatsapp', label: 'Whatsapp', disableSorting: true },
    { id: 'facebook', label: 'Facebook', disableSorting: true },
    { id: 'linkedin', label: 'Linkedin', disableSorting: true },
    { id: 'email', label: 'Email', disableSorting: true },
    { id: 'gender', label: 'Gender', disableSorting: true },
    { id: 'location', label: 'Location', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

const Freelancers = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)


    const [selectedImage, setSelectedImage] = useState(null)
    const [profile, setProfile] = useState(null)
    const [name, setName] = useState('')
    const [skills, setSkills] = useState('')
    const [industry, setIndustry] = useState('')
    const [title, setTitle] = useState('')
    const [titleOptions, setTitleOptions] = useState(null)
    const [experience, setExperience] = useState('')
    const [location, setLocation] = useState('')
    const [gender, setGender] = useState('male')

    const [mobile, setMobile] = useState('')
    const [facebook, setFacebook] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [skype, setSkype] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [email, setEmail] = useState('')

    const [portfolio1, setPortfolio1] = useState({ siteName: "", siteType: "", siteLink: "" })
    const [portfolio2, setPortfolio2] = useState({ siteName: "", siteType: "", siteLink: "" })
    const [portfolio3, setPortfolio3] = useState({ siteName: "", siteType: "", siteLink: "" })
    const [portfolio4, setPortfolio4] = useState({ siteName: "", siteType: "", siteLink: "" })
    const [portfolio5, setPortfolio5] = useState({ siteName: "", siteType: "", siteLink: "" })

    const [selectedFreelancer, setSelectedFreelancer] = useState(null)


    //filter state
    const [search, setSearch] = useState('')

    const [industryF, setIndustryF] = useState('')
    const [titleF, setTitleF] = useState('')
    const [titleOptionsF, setTitleOptionsF] = useState(null)
    const [experienceF, setExperienceF] = useState('')
    const [genderF, setGenderF] = useState('')
    const [locationF, setLocationF] = useState('')



    const [records, setRecords] = useState([])
    const [recordsAll, setRecordsAll] = useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);


    const divisions = [
        { value: "barisal", label: "Barisal" },
        { value: "chittagong", label: "Chittagong" },
        { value: "dhaka", label: "Dhaka" },
        { value: "khulna", label: "Khulna" },
        { value: "mymensingh", label: "Mymensingh" },
        { value: "rajshahi", label: "Rajshahi" },
        { value: "rangpur", label: "Rangpur" },
        { value: "sylhet", label: "Sylhet" },
    ]
    const design = [
        { value: "ui-ux-designer", label: "UI UX designer" },
        { value: "facebook-cover-designer", label: "Facebook cover designer" },
        { value: "logo-designer", label: "Logo designer" },
        { value: "motion-designer", label: "Motion designer" },
        { value: "book-cover-designer", label: "Book cover designer" },
        { value: "interior-designer", label: "Interior designer" },
        { value: "cliping-path", label: "Cliping path" },
        { value: "photo-retouching", label: "Photo retouching" },
        { value: "photo-editing", label: "Photo editing" },
        { value: "visiting-card-designer", label: "Visiting card designer" },
        { value: "web-banner-designer", label: "Web banner designer" },
        { value: "flyer-designer", label: "Flyer designer" },
        { value: "cv-designer", label: "CV designer" },
    ]
    const development = [
        { value: "html-developer", label: 'Html developer' },
        { value: "php-developer", label: "Php developer" },
        { value: "nodejs-developer", label: "Node js developer" },
        { value: "python-developer", label: "Python developer" },
        { value: "asp-dot-net-developer", label: "ASP.NET developer" },
        { value: "ruby-rails-developer", label: "Ruby Rails developer" },
        { value: "dart-developer", label: "Dart developer" },
        { value: "IOS-developer", label: "IOS developer" },
        { value: "android-developer", label: "Android developer" },
        { value: "native-app-developer", label: "Native App developer" },
    ]
    const marketing = [
        { value: "backlink-expert", label: "Backlink Expert" },
        { value: "content-writter", label: "Content writter" },
        { value: "on-page-expert", label: "On page expert" },
        { value: "off-page-expert", label: "Off page expert" },
        { value: "email-marketer", label: "Email marketer" },
        { value: "offline-marketer", label: "Offline marketer" },
        { value: "local-media-buyer", label: "Local media buyer" },
        { value: "data-entry", label: "Data entry" },
        { value: "lead-generation", label: "Lead generation" },
        { value: "web-research", label: "Web research" },
    ]
    useEffect(() => {

        if (industry) {
            if (industry === 'marketing') {
                setTitleOptions(marketing)
            } else if (industry === 'development') {
                setTitleOptions(development)
            } else if (industry === 'design') {
                setTitleOptions(design)
            } else {
                setTitleOptions(null)
            }
        }
        else {
            setTitleOptions(null)
        }
    }, [industry])

    useEffect(() => {

        if (industryF) {
            if (industryF === 'marketing') {
                setTitleOptionsF(marketing)
            } else if (industryF === 'development') {
                setTitleOptionsF(development)
            } else if (industryF === 'design') {
                setTitleOptionsF(design)
            } else {
                setTitleOptionsF(null)
            }
        }
        else {
            setTitleOptionsF(null)
        }
    }, [industryF])

    useEffect(() => {
        setLoading(true)
        axios.get('/freelancer/getall')
            .then(res => {
                setLoading(false)
                setRecords(res.data.freelancers)
                setRecordsAll(res.data.freelancers)
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }, [])

    const handleSearch = e => {

        if (search === '' && industryF == '' && titleF == '' && experienceF == '' && genderF == '' && locationF == '') {
            return setRecords(recordsAll)
        } else {
            let filtered = recordsAll.filter(x =>
                (x.name.toLowerCase().includes(search) ||
                    x.contacts.phone.includes(search) ||
                    x.contacts.whatsapp.includes(search) ||
                    x.contacts.email.includes(search) ||
                    x.contacts.skype.includes(search) ||
                    x.contacts.facebook.includes(search) ||
                    x.contacts.linkedin.includes(search)) &&
                (
                    x.title.includes(titleF) &&
                    x.industry.includes(industryF) &&
                    x.experience.includes(experienceF) &&
                    x.gender.includes(genderF) &&
                    x.location.includes(locationF)
                )
            )
            setRecords(filtered)
        }
    }

    const getTitle = (title) => {
        if (!title) {
            return '-'
        }

        let filteredDev = development.filter(x => x.value === title)
        let filteredMark = marketing.filter(x => x.value === title)
        let filteredDes = design.filter(x => x.value === title)

        return filteredDev[0]?.label || filteredMark[0]?.label || filteredDes[0]?.label
    }



    //--------------------delete
    const handleDelete = (id) => {

        let consent = window.confirm("Are you sure ?")
        if (consent) {
            setLoading(true)
            axios.delete('/freelancer/delete/' + id)
                .then(res => {
                    if (res.data.success) {
                        let temp = [...records]
                        let index = temp.findIndex(article => article._id === id)
                        temp.splice(index, 1)
                        setRecords(temp)
                        setRecordsAll(temp)
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




    const handleClickOpen = (freelancer) => {
        setSelectedFreelancer(freelancer)
        setName(freelancer.name)
        setSkills(freelancer.skills)
        setIndustry(freelancer.industry)
        setTitle(freelancer.title)
        setExperience(freelancer.experience)
        setLocation(freelancer.location)
        setGender(freelancer.gender)
        setMobile(freelancer.contacts.phone)
        setFacebook(freelancer.contacts.facebook)
        setLinkedin(freelancer.contacts.linkedin)
        setSkype(freelancer.contacts.skype)
        setWhatsapp(freelancer.contacts.whatsapp)
        setEmail(freelancer.contacts.email)
        setSelectedImage(null)
        setProfile(freelancer.profile)
        setPortfolio1({ siteName: freelancer.portfolios[0].siteName, siteType: freelancer.portfolios[0].siteType, siteLink: freelancer.portfolios[0].siteLink })
        setPortfolio2({ siteName: freelancer.portfolios[1].siteName, siteType: freelancer.portfolios[1].siteType, siteLink: freelancer.portfolios[1].siteLink })
        setPortfolio3({ siteName: freelancer.portfolios[2].siteName, siteType: freelancer.portfolios[2].siteType, siteLink: freelancer.portfolios[2].siteLink })
        setPortfolio4({ siteName: freelancer.portfolios[3].siteName, siteType: freelancer.portfolios[3].siteType, siteLink: freelancer.portfolios[3].siteLink })
        setPortfolio5({ siteName: freelancer.portfolios[4].siteName, siteType: freelancer.portfolios[4].siteType, siteLink: freelancer.portfolios[4].siteLink })
        setOpen(true);

    };
    const handleShow = (freelancer) => {
        setSelectedFreelancer(freelancer)
        setShow(true);
    }
    const handleClose = () => {
        setOpen(false);
        setName('')
        setSkills('')
        setIndustry('')
        setTitle('')
        setExperience('')
        setLocation('')
        setGender('male')
        setMobile('')
        setFacebook('')
        setLinkedin('')
        setSkype('')
        setWhatsapp('')
        setEmail('')
        setSelectedImage(null)
        setProfile(null)
        setPortfolio1({ siteName: "", siteType: "", siteLink: "" })
        setPortfolio2({ siteName: "", siteType: "", siteLink: "" })
        setPortfolio3({ siteName: "", siteType: "", siteLink: "" })
        setPortfolio4({ siteName: "", siteType: "", siteLink: "" })
        setPortfolio5({ siteName: "", siteType: "", siteLink: "" })

        setSelectedFreelancer(null)

    };
    const handleClosePreview = () => {
        setShow(false)
        setSelectedFreelancer(null)
    }


    const saveFreelancer = () => {
        if (!name || !gender) {
            return alert("Name and gender is required")
        }

        let contacts = {
            phone: mobile,
            facebook,
            skype,
            linkedin,
            whatsapp,
            email
        }
        let portfolios = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5]



        let formData = new FormData()
        formData.append('name', name)
        formData.append('gender', gender)
        formData.append('skills', skills)
        formData.append('industry', industry)
        formData.append('title', title)
        formData.append('experience', experience)
        formData.append('location', location)
        formData.append('contacts', JSON.stringify(contacts))
        formData.append('portfolios', JSON.stringify(portfolios))

        formData.append('freelancerImg', selectedImage)

        axios.post('/freelancer/create', formData)
            .then(res => {
                setLoading(false)
                setRecords([res.data.freelancer, ...records])
                setRecordsAll([res.data.freelancer, ...records])
                handleClose()
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }
    //---------edit
    const updatePortfolio = (id) => {

        if (!name || !gender) {
            return alert("Name and gender is required")
        }
        setLoading(true)
        let contacts = {
            phone: mobile,
            facebook,
            skype,
            linkedin,
            whatsapp,
            email
        }
        let portfolios = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5]


        let formData = new FormData()
        formData.append('name', name)
        formData.append('gender', gender)
        formData.append('skills', skills)
        formData.append('industry', industry)
        formData.append('title', title)
        formData.append('experience', experience)
        formData.append('location', location)
        formData.append('contacts', JSON.stringify(contacts))
        formData.append('portfolios', JSON.stringify(portfolios))

        formData.append('freelancerImg', selectedImage)

        axios.patch('/freelancer/edit/' + id, formData)
            .then(res => {
                if (res.data.success) {
                    let temp = [...records]
                    let index = temp.findIndex(portfolio => portfolio._id === id)
                    temp[index] = res.data.freelancer
                    setRecords(temp)
                    setRecordsAll(temp)
                    handleClose()
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }


    const getExperience = (lvl) => {
        if (!lvl) {
            return '-'
        } else if (lvl === "level-1") {
            return '>1 years'
        } else if (lvl === "level-2") {
            return '1-5 years'
        } else if (lvl === "level-3") {
            return '5-10 years'
        } else if (lvl === "level-4") {
            return '10+ years'
        }
    }

    //--bulk------------
    const [csv, setCsv] = useState('')
    const [openCsv, setOpenCsv] = useState(false)
    const handleClickOpenImport = () => {
        setOpenCsv(true)
    }
    const handleCloseCsv = () => {
        setOpenCsv(false)
    }
    const handleSaveCsv = () => {
        setLoading(true)
        let formData = new FormData()
        formData.append('file', csv)
        axios.post('/freelancer/bulk', formData)
            .then(res => {
                setLoading(false)
                
                // setRecords([res.data.documents, ...records])
                // setRecordsAll([res.data.documents, ...records])
                window.location.reload()
                handleClose()
            })
            .catch(err => {
                setLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }

    return (
        <Page
            className={classes.root}
            title="Freelancers"
        >
            <Dialog
                open={openCsv}
                onClose={handleCloseCsv}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Upload Bulk Freelancers</DialogTitle>
                <DialogContent>
                    <label>Accepted file format is (.csv)</label><br></br>
                    <input onChange={(e) => setCsv(e.target.files[0])} className={classes.fileInput} type='file' accept='.csv'></input>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCsv} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleSaveCsv()} color="primary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Container maxWidth={false}>
                <Box display="flex" justifyContent="flex-end" >
                    <Button onClick={() => handleClickOpenImport()} className={classes.importButton}>
                        Bulk upload
                    </Button>
                    <CSVLink data={records} headers={headers}>
                    <Button className={classes.exportButton}>
                    Export to CSV
                    </Button>
                    </CSVLink>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setOpen(true)}
                    >
                        Add New Freelancer
                    </Button>
                </Box>
                <Paper className={classes.pageContent}>

                    {/* <Toolbar>
                        <TextField
                            variant='outlined'
                            label="Enter name"
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
                                    <TableCell><img style={{ height: "50px", width: "75px", objectFit: "contain" }} src={item.profile}></img></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.gender}</TableCell>
                                    <TableCell>{item.skills}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{getExperience(item.experience)}</TableCell>
                                    <TableCell>{item.industry}</TableCell>
                                    <TableCell>{item.title}</TableCell>
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
                    <TblPagination /> */}


                    <div className="container" >
                        <div className={styles.searchContainer}>
                            <div className={styles.search}>
                                <div class="input-group mb-3">
                                    <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" class="form-control" placeholder="Search By Name, phone, email, whatsapp, facebook, skype, linkedin" />
                                    <button onClick={() => handleSearch()} className={`input-group-text ${styles.searchbtn}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg></button>
                                </div>
                            </div>
                            <div className={styles.filter}>
                                <select value={industryF} onChange={(e) => setIndustryF(e.target.value)} className="form-control" aria-label="Default select example">
                                    <option value='' selected>Select Industry</option>
                                    <option value="design">Design</option>
                                    <option value="development">Development</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                                <select value={titleF} onChange={(e) => setTitleF(e.target.value)} className="form-control" aria-label="Default select example">
                                    <option value='' selected>Select Title</option>
                                    {
                                        titleOptionsF && titleOptionsF.map((opt, index) => {
                                            return (
                                                <option key={index} value={opt.value}>{opt.label}</option>
                                            )
                                        })
                                    }

                                </select>
                                <select value={experienceF} onChange={(e) => setExperienceF(e.target.value)} className="form-control" aria-label="Default select example">
                                    <option value='' selected>Select Experience</option>
                                    <option value='level-1'>{'>1'} years</option>
                                    <option value='level-2'>1-5 years</option>
                                    <option value='level-3'>5-10 years</option>
                                    <option value='level-4'>10+ years</option>
                                </select>
                                <select value={genderF} onChange={(e) => setGenderF(e.target.value)} className="form-control" aria-label="Default select example">
                                    <option value='' selected>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <select value={locationF} onChange={(e) => setLocationF(e.target.value)} className="form-control" aria-label="Default select example">
                                    <option value='' selected>Select Location</option>
                                    {
                                        divisions.map((opt, index) => {
                                            return (
                                                <option key={index} value={opt.value}>{opt.label}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div style={{ overflow: "auto" }}>
                            <TblContainer>
                                {
                                    loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>loading..</div> :
                                        recordsAfterPagingAndSorting().length > 0 ?
                                            <><TblHead />

                                                <TableBody>
                                                    {

                                                        recordsAfterPagingAndSorting().map((item, index) =>
                                                        (<TableRow key={item._id}>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.skills || "-"}</TableCell>
                                                            <TableCell>{getTitle(item.title)}</TableCell>
                                                            <TableCell>{getExperience(item.experience)}</TableCell>
                                                            <TableCell>{item.industry || "-"}</TableCell>
                                                            <TableCell>{item.contacts.phone || "-"}</TableCell>
                                                            <TableCell>{item.contacts.skype || "-"}</TableCell>
                                                            <TableCell>{item.contacts.whatsapp || '-'}</TableCell>
                                                            <TableCell>{item.contacts.facebook || '-'}</TableCell>
                                                            <TableCell>{item.contacts.linkedin || '-'}</TableCell>
                                                            <TableCell>{item.contacts.email || '-'}</TableCell>
                                                            <TableCell>{item.gender || '-'}</TableCell>
                                                            <TableCell>{item.location || '-'}</TableCell>


                                                            <TableCell>
                                                                <div style={{ display: "flex" }}>
                                                                    <IconButton
                                                                        color="default"
                                                                        onClick={() => handleShow(item)}>
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
                                            </> : <><TblHead /><caption>No freelancers found</caption></>
                                }


                            </TblContainer>

                        </div>
                        <TblPagination />
                    </div>


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
                    <DialogTitle id="alert-dialog-title">{selectedFreelancer ? "Update" : "Create"} Freelancer</DialogTitle>
                    <DialogContent style={{ width: "60vw" }}>

                        <Grid container spacing={3}>
                            <Grid item xs={9}>
                                <TextField
                                    variant='outlined'
                                    label="Name"
                                    className={classes.searchInput}
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    style={{ width: "100%" }}
                                />
                                <TextField
                                    variant='outlined'
                                    label="Skills"
                                    className={classes.searchInput}
                                    onChange={(e) => setSkills(e.target.value)}
                                    value={skills}
                                    style={{ width: "100%", marginTop: "10px" }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <label
                                    style={{ backgroundImage: `url(${profile ? profile : selectedImage ? URL.createObjectURL(selectedImage) : null})`, backgroundSize: "cover" }}
                                    className={classes.fileLabel}
                                    htmlFor='profileimage'>
                                    <AddIcon /></label>
                                <input onChange={(e) => setSelectedImage(e.target.files[0])} id='profileimage' type='file' accept='image/*' hidden></input>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id="industry">Industry</InputLabel>
                                    <Select
                                        labelId="industry"
                                        id="industry-outlined"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        label="Industry"
                                        style={{ width: "100%" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value='design'>Design</MenuItem>
                                        <MenuItem value='development'>Development</MenuItem>
                                        <MenuItem value='marketing'>Marketing</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id="title">Title</InputLabel>
                                    <Select
                                        labelId="title"
                                        id="title-outlined"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        label="Title"
                                        style={{ width: "100%" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            titleOptions && titleOptions.map((item, index) => {
                                                return (
                                                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                                )
                                            })

                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id="gender">Gender</InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-outlined"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        label="Gender"
                                        style={{ width: "100%" }}
                                    >

                                        <MenuItem value='male'>Male</MenuItem>
                                        <MenuItem value='female'>Female</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id="experience">Experience</InputLabel>
                                    <Select
                                        labelId="experience"
                                        id="experience-outlined"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        label="Experience"
                                        style={{ width: "100%" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value='level-1'>{'>1'} years</MenuItem>
                                        <MenuItem value='level-2'>1-5 years</MenuItem>
                                        <MenuItem value='level-3'>5-10 years</MenuItem>
                                        <MenuItem value='level-4'>10+ years</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id="location">Location</InputLabel>
                                    <Select
                                        labelId="location"
                                        id="location-outlined"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        label="Location"
                                        style={{ width: "100%" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            divisions.map((division, index) => {
                                                return (
                                                    <MenuItem value={division.value} key={index}>{division.label}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider style={{ margin: "10px 0" }} />
                        <div style={{ textAlign: "center" }}>
                            <Typography variant='subtitle2'>Contacts</Typography>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="Mobile"
                                    className={classes.searchInput}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="whatsapp"
                                    className={classes.searchInput}
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="Facebook"
                                    className={classes.searchInput}
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="Linkedin"
                                    className={classes.searchInput}
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="Skype"
                                    className={classes.searchInput}
                                    value={skype}
                                    onChange={(e) => setSkype(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='outlined'
                                    label="Email"
                                    className={classes.searchInput}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>

                        <Divider style={{ margin: "10px 0" }} />
                        <div style={{ textAlign: "center" }}>
                            <Typography variant='subtitle2'>Portfolios</Typography>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />

                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Name"
                                    className={classes.searchInput}
                                    value={portfolio1.siteName}
                                    onChange={(e) => setPortfolio1({ ...portfolio1, siteName: e.target.value })}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Type"
                                    className={classes.searchInput}
                                    value={portfolio1.siteType}
                                    onChange={(e) => setPortfolio1({ ...portfolio1, siteType: e.target.value })}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Link"
                                    className={classes.searchInput}
                                    value={portfolio1.siteLink}
                                    onChange={(e) => setPortfolio1({ ...portfolio1, siteLink: e.target.value })}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Name"
                                    className={classes.searchInput}
                                    value={portfolio2.siteName}
                                    onChange={(e) => setPortfolio2({ ...portfolio2, siteName: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio1.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Type"
                                    className={classes.searchInput}
                                    value={portfolio2.siteType}
                                    onChange={(e) => setPortfolio2({ ...portfolio2, siteType: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio1.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Link"
                                    className={classes.searchInput}
                                    value={portfolio2.siteLink}
                                    onChange={(e) => setPortfolio2({ ...portfolio2, siteLink: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio1.siteName === '' ? true : false}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Name"
                                    className={classes.searchInput}
                                    value={portfolio3.siteName}
                                    onChange={(e) => setPortfolio3({ ...portfolio3, siteName: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio2.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Type"
                                    className={classes.searchInput}
                                    value={portfolio3.siteType}
                                    onChange={(e) => setPortfolio3({ ...portfolio3, siteType: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio2.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Link"
                                    className={classes.searchInput}
                                    value={portfolio3.siteLink}
                                    onChange={(e) => setPortfolio3({ ...portfolio3, siteLink: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio2.siteName === '' ? true : false}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Name"
                                    className={classes.searchInput}
                                    value={portfolio4.siteName}
                                    onChange={(e) => setPortfolio4({ ...portfolio4, siteName: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio3.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Type"
                                    className={classes.searchInput}
                                    value={portfolio4.siteType}
                                    onChange={(e) => setPortfolio4({ ...portfolio4, siteType: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio3.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Link"
                                    className={classes.searchInput}
                                    value={portfolio4.siteLink}
                                    onChange={(e) => setPortfolio4({ ...portfolio4, siteLink: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio3.siteName === '' ? true : false}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Name"
                                    className={classes.searchInput}
                                    value={portfolio5.siteName}
                                    onChange={(e) => setPortfolio5({ ...portfolio5, siteName: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio4.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Type"
                                    className={classes.searchInput}
                                    value={portfolio5.siteType}
                                    onChange={(e) => setPortfolio5({ ...portfolio5, siteType: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio4.siteName === '' ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant='outlined'
                                    label="Site Link"
                                    className={classes.searchInput}
                                    value={portfolio5.siteLink}
                                    onChange={(e) => setPortfolio5({ ...portfolio5, siteLink: e.target.value })}
                                    style={{ width: "100%" }}
                                    disabled={portfolio4.siteName === '' ? true : false}
                                />
                            </Grid>
                        </Grid>




                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Cancle
                        </Button>
                        {
                            selectedFreelancer ? <Button onClick={() => updatePortfolio(selectedFreelancer._id)} color="primary">
                                Update
                            </Button> :
                                <Button onClick={() => saveFreelancer()} color="primary">
                                    Create
                            </Button>

                        }
                    </DialogActions>
                </Dialog>
            </div>

            <Dialog
                open={show}
                onClose={handleClosePreview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

                maxWidth='lg'

            >
                <div className={styles.modalHeader}>
                    <h5>Freelancer Details</h5>
                    <span style={{ cursor: "pointer" }} onClick={() => handleClosePreview()} className='close'>x</span>
                </div>
                <DialogContent>
                    <div style={{ width: "70vw" }}>
                        <div className='row' >
                            <div className='col-md-3'>
                                <img className={styles.avatar} src={selectedFreelancer && selectedFreelancer.profile ? selectedFreelancer.profile : "https://www.auramarine.com/wp-content/uploads/2018/03/man-placeholder-e1520494457998.png"}></img>
                            </div>
                            <div className='col-md-9'>
                                <div className='ml-1'>
                                    <table className={styles.infoTable}>
                                        <tr>
                                            <td><span>Name</span></td>
                                            <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.name}</p></td>
                                        </tr>
                                        <tr>
                                            <td><span>Skills</span></td>
                                            <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.skills}</p></td>
                                        </tr>
                                        <tr>
                                            <td><span>Title</span></td>
                                            <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && getTitle(selectedFreelancer.title)}</p></td>
                                        </tr>
                                        <tr>
                                            <td><span>Experience</span></td>
                                            <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && getExperience(selectedFreelancer.experience)}</p></td>
                                        </tr>
                                        <tr>
                                            <td><span>Industry</span></td>
                                            <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.industry}</p></td>
                                        </tr>
                                    </table>

                                    <button className={styles.pdfBtn}>
                                        DOWNLOAD AS PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        <label className={styles.subHeading}>Communication Details</label>
                        <div className='row my-2'>
                            <div className='col-md-6'>
                                <tr>
                                    <td><span>Phone</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.name || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td><span>Skype</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.skype || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td><span>Whatsapp</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.whatsapp || "N/A"}</p></td>
                                </tr>
                            </div>
                            <div className='col-md-6'>
                                <tr>
                                    <td><span>Facebook</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.facebook || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td><span>Linkedin</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.linkedin || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td><span>Email</span></td>
                                    <td><p className='ml-1'><span className='mr-1'>:</span>{selectedFreelancer && selectedFreelancer.contacts.email || "N/A"}</p></td>
                                </tr>
                            </div>
                        </div>

                        <label className={styles.subHeading}>Portfolios</label>
                        <div>
                            {
                                selectedFreelancer && selectedFreelancer.portfolios.map((port, index) => {
                                    if (port.siteName == '') return
                                    return (
                                        <div className={styles.singlePortfolio}>
                                            <div className={styles.index}><span className={styles.portfolioIndex}>0{index + 1}</span></div>
                                            <div>
                                                <tr>
                                                    <td><span>Site Name</span></td>
                                                    <td><p className='ml-1'><span className='mr-1'>:</span>{port.siteName}</p></td>
                                                </tr>
                                                <tr>
                                                    <td><span>Site Type</span></td>
                                                    <td><p className='ml-1'><span className='mr-1'>:</span>{port.siteType}</p></td>
                                                </tr>
                                                <tr>
                                                    <td><span>Site Link</span></td>
                                                    <td><p className='ml-1'><span className='mr-1'>:</span>{port.siteLink}</p></td>
                                                </tr>
                                            </div>
                                        </div>
                                    )
                                })
                            }



                        </div>
                    </div>
                </DialogContent>

            </Dialog>

            <Backdrop style={{ zIndex: "999999" }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Page>
    );
};

export default Freelancers
