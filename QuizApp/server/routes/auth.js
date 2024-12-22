const express = require('express');
const router = express.Router();
const uploadMiddleware = require("../middleware/MulterMiddleware");
const {voirstatus,changepwd,getAllUsersExceptRh ,uploadPhoto,deletePhoto ,updateDarkMode,register,searchByName,searchByEmail,searchByProfessionalTitle,searchByLanguages,searchByCity,searchByMobileNumber,searchByCompany,searchByCountry, login,getFriends, deleteUser ,getSuggestions, getAllCandidates,updateUser,getUserById } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
// Get all candidates
router.get('/all', getAllCandidates);
router.get('/users/exclude/:rhId', getAllUsersExceptRh);

router.get('/sugg/:userId', getSuggestions);
router.get('/friends/:rhId/',getFriends);
router.delete('/users/:userId', deleteUser);
router.put('/userupdate/:userId', updateUser);
// Route to fetch user details by ID
router.get('/user/:userId', getUserById);


router.get('/voirstatus/:userId/:otherId',voirstatus);


router.get('/search/name', searchByName);

// Recherche par email
router.get('/search/email', searchByEmail);

// Recherche par numéro de téléphone
router.get('/search/mobileNumber', searchByMobileNumber);

// Recherche par société (company dans recentJobPosts)
router.get('/search/company', searchByCompany);

// Recherche par pays
router.get('/search/country', searchByCountry);

// Recherche par ville
router.get('/search/city', searchByCity);
router.put('/darkmode/:userId',updateDarkMode);
// Recherche par langues
router.get('/search/languages', searchByLanguages);
 
router.put('/changepwd/:id',changepwd);
// Recherche par titre professionnel
router.get('/search/professionalTitle', searchByProfessionalTitle);
router.get('/search', async (req, res) => {
    const {
      name,
      email,
      mobileNumber,
      company,
      country,
      city,
      language,
      professionalTitle
    } = req.query;
  
    try {
      let users = [];
      if (name) {
        users = await searchByName(req, res);
      } else if (email) {
        users = await searchByEmail(req, res);
      } else if (mobileNumber) {
        users = await searchByMobileNumber(req, res);
      } else if (company) {
        users = await searchByCompany(req, res);
      } else if (country) {
        users = await searchByCountry(req, res);
      } else if (city) {
        users = await searchByCity(req, res);
      } else if (language) {
        users = await searchByLanguages(req, res);
      } else if (professionalTitle) {
        users = await searchByProfessionalTitle(req, res);
      } else {
        res.status(400).json({ message: 'No search parameters provided' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/:id/upload', uploadMiddleware.single('photo'), uploadPhoto);

    router.delete('/:id/photo', deletePhoto);
module.exports = router;
