import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';

const HolidayManager = () => {
  const [holidays, setHolidays] = useState([
    { id: 1, name: 'New Year', date: '2026-01-01', type: 'Public' },
    { id: 2, name: 'Republic Day', date: '2026-01-26', type: 'Gazetted' },
  ]);

  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Public' });

  // নতুন ছুটি অ্যাড করার ফাংশন
  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (newHoliday.name && newHoliday.date) {
      setHolidays([...holidays, { ...newHoliday, id: Date.now() }]);
      setNewHoliday({ name: '', date: '', type: 'Public' }); // ফর্ম রিসেট
    }
  };

  // ছুটি ডিলিট করার ফাংশন
  const deleteHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* LEFT: HR ADD FORM */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary-subtle p-2 rounded-3 me-3 text-primary">
                <i className="bi bi-calendar-plus fs-4"></i>
              </div>
              <h5 className="fw-bold m-0">Add Holiday</h5>
            </div>
            
            <Form onSubmit={handleAddHoliday}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Holiday Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. Eid-ul-Fitr"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                  className="rounded-3"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                  className="rounded-3"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold">Type</Form.Label>
                <Form.Select 
                  value={newHoliday.type}
                  onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
                  className="rounded-3"
                >
                  <option value="Public">Public Holiday</option>
                  <option value="Gazetted">Gazetted</option>
                  <option value="Optional">Optional</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-2 fw-bold rounded-pill shadow-sm">
                <i className="bi bi-plus-circle me-2"></i>Publish Holiday
              </Button>
            </Form>
          </Card>
        </Col>

        {/* RIGHT: HOLIDAY LIST TABLE */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-white py-3 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold m-0 text-secondary">Upcoming Holidays</h5>
                <Badge bg="info" className="rounded-pill px-3">{holidays.length} Total</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light text-muted small text-uppercase">
                  <tr>
                    <th className="px-4 py-3 border-0">Holiday</th>
                    <th className="py-3 border-0">Date</th>
                    <th className="py-3 border-0">Type</th>
                    <th className="py-3 border-0 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.length > 0 ? (
                    holidays.map((holiday) => (
                      <tr key={holiday.id} className="align-middle">
                        <td className="px-4 py-3 fw-bold text-dark">{holiday.name}</td>
                        <td className="py-3 text-muted">
                          <i className="bi bi-calendar3 me-2 text-primary"></i>
                          {new Date(holiday.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3">
                          <Badge bg={holiday.type === 'Public' ? 'success-subtle' : 'warning-subtle'} text={holiday.type === 'Public' ? 'success' : 'warning'} className="px-3">
                            {holiday.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Button 
                            variant="link" 
                            className="text-danger p-0 shadow-none"
                            onClick={() => deleteHoliday(holiday.id)}
                          >
                            <i className="bi bi-trash3-fill fs-5"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted small">No holidays added yet.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HolidayManager;