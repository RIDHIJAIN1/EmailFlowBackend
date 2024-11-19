const {Router} = require('express');
const AuthController = require('../controllers/AuthController');
const ProjectController = require('../controllers/ProjectController');
const MailController = require('../controllers/MailController');
const WaitController = require('../controllers/WaitController');
const MappingController = require('../controllers/MappingController');
const ListController = require('../controllers/ListController');
const { isAuthenticated } = require('../middlewares/Authenticated');
const upload = require('../utils/multerConfig'); // Import the multer configuration

const router = Router();

// router.get('/', AuthController.index);
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

router.get('/projects', isAuthenticated, ProjectController.index);
router.post('/projects', isAuthenticated, ProjectController.create);
router.get('/projects/:id', isAuthenticated, ProjectController.projectById);
router.put('/sequence/:id' , isAuthenticated , ProjectController.updateSequence)
router.put('/projects/:id', isAuthenticated, ProjectController.edit);
router.delete('/projects/:id', isAuthenticated, ProjectController.remove);
router.post('/project/start/:id', isAuthenticated, ProjectController.start);

router.post('/list', isAuthenticated, upload.single('file'), ListController.createList);
router.get('/lists', isAuthenticated, ListController.getLists);
router.get('/list/:listId', isAuthenticated, ListController.getListDetails);
router.put('/list/:id', isAuthenticated, upload.single('file'), ListController.editList);  // Added upload.single('file') for edit
router.delete('/list/:id', isAuthenticated, ListController.deleteList);

router.post('/mapping', MappingController.createMapping);                // Create multiple Mappings
router.get('/mappings/:list_id', MappingController.getMappings);         // Get Mappings for a specific list_id with pagination
router.put('/mapping/:list_id', MappingController.updateMappings); 

router.post('/mails', isAuthenticated, MailController.createMail); // Create a Mail
router.get('/mails', isAuthenticated, MailController.getMails); // Get all Mails with pagination
router.get('/mails/:id', isAuthenticated, MailController.getMail); // Get a specific Mail
router.put('/mails/:id', isAuthenticated, MailController.editMail); // Edit a Mail
router.delete('/mails/:id', isAuthenticated, MailController.deleteMail); // Delete a Mail

router.post('/wait', WaitController.createWait);             // Create a new Wait
router.get('/wait', WaitController.getWaits);             // Create a new Wait
router.get('/wait/:id', WaitController.getWaitById);             // Create a new Wait


module.exports = router;