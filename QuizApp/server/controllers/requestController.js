// requestController.js
const mongoose = require('mongoose');
const Request = require('../models/Request');
const ObjectId = mongoose.Types.ObjectId;

// Créer une nouvelle demande
exports.createRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;
    const request = new Request({ senderId, recipientId });
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir toutes les demandes
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Supprimer une demande par senderId et recipientId
exports.deleteRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    // Implémentez la logique pour supprimer la demande avec les IDs spécifiés
    // Exemple: Suppression dans une base de données
    const deletedRequest = await Request.deleteOne({ senderId, recipientId });

    if (deletedRequest.deletedCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updateRequestStatusById = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    const { status } = req.body;

    // Vérifier si la demande existe
    const request = await Request.findOne({ senderId, recipientId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Mettre à jour le statut de la demande
    request.status = status;
    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRequestStatus = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;

    // Recherchez la demande correspondant aux IDs spécifiés
    const request = await Request.findOne({ senderId, recipientId });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ status: request.status });
  } catch (error) {
    console.error('Error fetching request status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
/*
exports.getRequestStatus = async (req, res) => {
  try {
    const senderId = ObjectId(req.params.senderId); // Convertir en ObjectId

    const requests = await Request.find({ senderId: senderId });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des requêtes' });
  }
};
*/

// Contrôleur pour récupérer toutes les demandes en attente d'un destinataire spécifique


exports.getPendingRequestsByRecipientId = async (req, res) => {
  const { recipientId } = req.params;

  try {
    const pendingRequests = await Request.find({ recipientId, status: 'pending' })
      .populate('senderId', 'name  role  recentJobPosts')
      .exec();

    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.cancelRequest = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;
    const request = await Request.findOneAndUpdate(
      { $or: [{ senderId: userId, recipientId: recipientId }, { senderId: recipientId, recipientId: userId }] },
      { status: 'canceled' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request canceled successfully' });
  } catch (error) {
    console.error('Error canceling request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};