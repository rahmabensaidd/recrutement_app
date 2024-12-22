// controllers/jobPostController.js

const JobPost = require('../models/JobPost');
const User = require('../models/User');

exports.createpost = async (req, res) => {
    try {
        const { 
            jobTitle, 
            jobType, 
            salary, 
            vacancies, 
            experience, 
            location, 
            description, 
            rhId, 
            canId 
        } = req.body;

        // Validation des données d'entrée
        if (!jobTitle || !jobType || !salary || !vacancies || !experience || !location || !description || !rhId) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs obligatoires doivent être remplis."
            });
        }

        // Création d'une nouvelle instance du job post
        const newJobPost = new JobPost({
            jobTitle,
            jobType,
            salary,
            vacancies,
            experience,
            location,
            description,
            rhId,
            canId, // Tableau d'IDs des candidats, facultatif
        });

        // Sauvegarde du job post dans la base de données
        await newJobPost.save();

        res.status(201).json({
            success: true,
            message: "Le job post a été créé avec succès.",
            jobPost: newJobPost
        });
    } catch (error) {
        console.error("Erreur lors de la création du job post :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur. Veuillez réessayer plus tard."
        });
    }
};
// Fonction pour récupérer tous les posts d'un recruteur spécifique
exports.getmyposts = async (req, res) => {
  const { rhId } = req.params; // Récupération de l'identifiant du recruteur depuis les paramètres de la requête

  try {
    // Rechercher tous les posts où le rhId correspond à celui du recruteur
    const posts = await JobPost.find({ rhId: rhId })
      .populate('canId', 'name email'); 

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts found for this recruiter." });
    }

    // Retourner les posts trouvés
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    // Gérer les erreurs éventuelles
    console.error("Error fetching posts:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
exports.deleteAllposts = async (req, res) => {
  const { rhId } = req.params; // Récupération de l'identifiant du recruteur depuis les paramètres de la requête

  try {
    // Supprimer tous les posts où le rhId correspond à celui du recruteur
    const result = await JobPost.deleteMany({ rhId: rhId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No posts found for this recruiter." });
    }

    // Retourner une réponse de succès
    return res.status(200).json({ success: true, message: "All posts deleted successfully." });
  } catch (error) {
    // Gérer les erreurs éventuelles
    console.error("Error deleting posts:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
exports.getpostbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await JobPost.findById(id).populate('canId', 'name email'); 

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Erreur lors de la récupération du job post :", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.deletepost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await JobPost.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Erreur lors de la suppression du job post :", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.allposts = async (req, res) => {
  try {
    // Trouver tous les postes d'emploi et peupler le champ rhId avec les informations de l'utilisateur
    const jobPosts = await JobPost.find()
      .populate({
        path: 'rhId',
        select: 'email', // Sélectionner uniquement le champ email
      });

    res.json({ jobPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.postulate = async (req, res) => {
  try {
    const { canId, id } = req.params;

    // Find the job post by id
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Find the candidate by id
    const candidate = await User.findById(canId); // Adjust if using 'Candidate'
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if candidate is already in the list
    if (jobPost.canId.includes(canId)) {
      return res.status(400).json({ message: 'Candidate already added' });
    }

    // Add the candidate to the list
    jobPost.canId.push(canId);
    await jobPost.save();

    res.status(200).json({ message: 'Candidate added successfully', jobPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};