// routes.js
const express = require('express');
const router = express.Router();
const { cancelRequest, createRequest, getAllRequests, getRequestStatus, deleteRequest, updateRequestStatusById,getPendingRequestsByRecipientId } = require('../controllers/requestController.js');

// Route pour créer une nouvelle demande
router.post('/send', createRequest);

// Route pour obtenir toutes les demandes
router.get('/getrequests', getAllRequests);


// Route pour obtenir le statut d'une demande spécifique
router.get('/:senderId/:recipientId', getRequestStatus);

// Route pour supprimer une demande
router.delete('/:senderId/:recipientId', deleteRequest);

// Route pour mettre à jour le statut d'une demande spécifique
router.put('/:senderId/:recipientId', updateRequestStatusById);
  
router.post('/cancelrequest/:userId/:recipientId', cancelRequest);

router.get('/requests/pending/:recipientId', getPendingRequestsByRecipientId);
module.exports = router;
