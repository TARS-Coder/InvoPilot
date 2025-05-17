import axios from 'axios';

const baseUrl = '/api/invoices';

const getNextInvoiceNumber = () => {
  return axios.get(`${baseUrl}/nextInvoiceNumber`)
    .then(response => response.data);
};

const getInvoices = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const createInvoice = (invoice) => {
  return axios.post(baseUrl, invoice).then(response => response.data);
};

const updateInvoice = (invoice) => {
  return axios.put(`${baseUrl}/${invoice._id}`, invoice).then(response => response.data);
};

const deleteInvoice = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
};

export default { getNextInvoiceNumber, getInvoices, createInvoice, updateInvoice, deleteInvoice };
