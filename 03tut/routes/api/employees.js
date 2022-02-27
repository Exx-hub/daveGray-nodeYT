const express = require("express");
const router = express.Router();

const employeeController = require("../../controllers/employeesController");

// router.get("/", (req, res) => {
//   res.json(data);
// });

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployeeById);

module.exports = router;
