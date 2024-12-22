const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Request = require('../models/Request');
const fs = require('fs');
const path = require('path');
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });

        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
     
        res.json({
            id: user._id, // Récupérer l'ID de l'utilisateur depuis MongoDB
            role: user.role,
            token  // Générer et renvoyer un token JWT si nécessaire
          });
      
    } catch (error) {
        res.status(400).send(error.message);
    }
};
// Fetch all candidates
exports.getAllCandidates = async (req, res) => {
    try {
      const candidates = await User.find({ role: 'candidate' });
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getSuggestions = async (req, res) => {
    try {
      const userId = req.params.userId;  // Correctly retrieve userId from req.params
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      console.log('userId:', userId);
  
      // Retrieve all users
      const allUsers = await User.find();
      console.log('allUsers:', allUsers);
  
      // Retrieve all requests where the user is either the sender or the recipient
      const relatedRequests = await Request.find({
        $or: [{ senderId: userId }, { recipientId: userId }]
      });
      console.log('relatedRequests:', relatedRequests);
  
      // Extract senderIds and recipientIds from the related requests, excluding the userId
      const senderIds = new Set(
        relatedRequests
          .map(request => request.senderId.toString())
          .filter(id => id !== userId)
      );
      const recipientIds = new Set(
        relatedRequests
          .map(request => request.recipientId.toString())
          .filter(id => id !== userId)
      );
      console.log('senderIds:', senderIds);
      console.log('recipientIds:', recipientIds);
  
      // Combine the two sets of IDs
      const relatedUserIds = new Set([...senderIds, ...recipientIds]);
      console.log('relatedUserIds:', relatedUserIds);
  
      // Filter users whose ID is not in relatedUserIds and is not userId
      const suggestions = allUsers.filter(user => {
        const userIdStr = user._id.toString();
        console.log('Comparing:', userIdStr, 'with', userId);
        return !relatedUserIds.has(userIdStr) && userIdStr !== userId;
      });
  
      console.log('suggestions:', suggestions);
  
      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
exports.deleteUser = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a route parameter

    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).send("Only admins can delete users.");
        }

        // Find the user to delete
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).send('User not found');
        }

        // Check if the user to delete is HR or candidate
        if (userToDelete.role === 'hr' || userToDelete.role === 'candidate') {
            await User.findByIdAndDelete(userId);
            return res.status(200).send('User deleted successfully');
        } else {
            return res.status(400).send('Cannot delete this type of user');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const {
      name,
      email,
      role,
      personalPhoto,
      placeOfResidence,
      recentJobPosts,
      training,
      mobileNumber,
      technologies,
      description,
      professionalTitle,
      softSkills,
      languages,
      hobbies,
      githubProfile,
      website,
      cvFile,
      linkedinProfile,
      password // Assuming password is also included in the update
    } = req.body;
  
    // Construct update object with defined attributes
    const updates = {
      name,
      email,
      role,
      personalPhoto,
      placeOfResidence,
      recentJobPosts,
      training,
      mobileNumber,
      technologies,
      description,
      professionalTitle,
      softSkills,
      languages,
      hobbies,
      githubProfile,
      website,
      cvFile,
      linkedinProfile,
      password
   
    };
  
    try {
      // Optional: Handle password update securely if needed
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password before updating
        updates.password = hashedPassword;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  };

// Fetch user by ID
exports.getUserById = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  exports.getFriends = async (req, res) => {
    try {
      const rhId = req.params.rhId;
  
      // Trouver toutes les requêtes où le senderId ou recipientId est égal à rhId et le statut est accepté
      const requests = await Request.find({
        $or: [
          { senderId: rhId, status: 'accepted' },
          { recipientId: rhId, status: 'accepted' }
        ]
      }).populate('senderId recipientId');
  
      // Extraire les objets utilisateur des requêtes trouvées
      const friends = requests.map(request => {
        // Si rhId est le senderId, l'ami est le recipientId
        if (request.senderId._id.toString() === rhId) {
          return request.recipientId;
        }
        // Sinon, l'ami est le senderId
        return request.senderId;
      });
  
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des amis' });
    }
  };
// Recherche par nom
// Recherche par nom
exports.searchByName = async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ name: { $regex: name, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par email
exports.searchByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const users = await User.find({ email: { $regex: email, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par numéro de téléphone
exports.searchByMobileNumber = async (req, res) => {
  const { mobileNumber } = req.query;
  try {
    const users = await User.find({ mobileNumber: { $regex: mobileNumber, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par société (company dans recentJobPosts)
exports.searchByCompany = async (req, res) => {
  const { company } = req.query;
  try {
    const users = await User.find({ 'recentJobPosts.company': { $regex: company, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par pays
exports.searchByCountry = async (req, res) => {
  const { country } = req.query;
  try {
    const users = await User.find({ 'placeOfResidence.country': { $regex: country, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par ville
exports.searchByCity = async (req, res) => {
  const { city } = req.query;
  try {
    const users = await User.find({ 'placeOfResidence.city': { $regex: city, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par langues
exports.searchByLanguages = async (req, res) => {
  const { language } = req.query;
  try {
    const users = await User.find({ 'languages.name': { $regex: language, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recherche par titre professionnel
exports.searchByProfessionalTitle = async (req, res) => {
  const { professionalTitle } = req.query;
  try {
    const users = await User.find({ professionalTitle: { $regex: professionalTitle, $options: 'i' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllUsersExceptRh = async (req, res) => {
  try {
    const { rhId } = req.params;
    const users = await User.find({ _id: { $ne: rhId } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};
exports.changepwd = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateDarkMode = async (req, res) => {
  const { userId } = req.params; // Get userId from the URL
  const { darkMode } = req.body; // Get the new darkMode value from the request body

  // Trim whitespace/newline characters from userId
  const trimmedUserId = userId.trim();

  // Validate that darkMode is a boolean
  if (typeof darkMode !== 'boolean') {
    return res.status(400).json({ message: 'darkMode must be a boolean' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      trimmedUserId,
      { darkMode },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Dark mode updated successfully', user });
  } catch (error) {
    console.error('Error updating dark mode:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.voirstatus = async (req, res) => {
  try {
    const { userId, otherId } = req.params;

    // Vérifier si les deux utilisateurs existent
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherId);

    if (!user || !otherUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Rechercher une requête entre les deux utilisateurs
    const request = await Request.findOne({
      $or: [
        { senderId: userId, recipientId: otherId },
        { senderId: otherId, recipientId: userId }
      ]
    });

    if (!request || 'canceled' ) {
      return res.status(200).json({ status: 'sendOrNo' });
    }

    // Vérifier le statut de la requête
    if (request.status === 'accepted') {
      return res.status(200).json({ status: 'friend' });
    } else if (request.status === 'pending') {
      if (request.senderId.toString() === userId) {
        return res.status(200).json({ status: 'cancelOrNo' });
      } else {
        return res.status(200).json({ status: 'deleteOrNo' });
      }
    } else {
      return res.status(400).json({ message: 'Statut de requête non valide' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.uploadPhoto = async (req, res) => {
  const userId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user already has a personal photo, delete the old one
    if (user.personalPhoto) {
      const oldPath = path.join(__dirname, '..', 'public', 'uploads', user.personalPhoto);
      fs.unlink(oldPath, (err) => {
        if (err) console.error(err);
      });
    }

    user.personalPhoto = file.filename;
    await user.save();

    res.status(200).json({ message: "Photo uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete photo file from server
    if (user.personalPhoto) {
      const oldPath = path.join(__dirname, '..', 'public', 'uploads', user.personalPhoto);
      fs.unlink(oldPath, (err) => {
        if (err) console.error(err);
      });
    }

    user.personalPhoto = '';
    await user.save();

    res.status(200).json({ message: "Photo deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};