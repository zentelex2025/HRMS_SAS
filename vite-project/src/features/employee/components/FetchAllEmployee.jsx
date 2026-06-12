import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const FetchAllEmployee = ({ employeeData }) => {
  return (
    <main className="container">
      <Box className="employee-list">
        <Box className="employee-list__header">
          <Typography variant="h5">Employee Management</Typography>

          <Box className="employee-list__actions">
            <TextField
              placeholder="Search by Name, Department, or Site"
              size="small"
            />

            <Button variant="contained">Add Employee</Button>
          </Box>
        </Box>

        <Paper className="employee-list__table">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employeeData.map((employee, index) => (
                  <TableRow key={employee.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{employee.id}</TableCell>

                    <TableCell>
                      <Avatar
                        src={employee.image}
                        alt={employee.name}
                        sx={{
                          width: 42,
                          height: 42,
                        }}
                      />
                    </TableCell>

                    <TableCell>{employee.name}</TableCell>

                    <TableCell>{employee.email}</TableCell>

                    <TableCell>
                      <Chip
                        label={employee.department}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={employee.site}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={employee.designation}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Button size="small" variant="contained">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </main>
  );
};

export default FetchAllEmployee;
