// Fonction pour vérifier les erreurs de validation et renvoyer une réponse en cas d'erreur
function validationCheck(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.debug('Validation errors:', errors.array());
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
  }
} 

module.exports = validationCheck;