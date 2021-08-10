import axios from "axios";
const clientsURL = "http://localhost:80/clients/";
// const clientsURL = "https://sunrise-agency.herokuapp.com/clients/";

export function getClients() {
  return axios.get(clientsURL + "get/");
}
export function addClient(client) {
  console.log(client.image)
  return axios.post(clientsURL + "add/", client.image, {
    headers: {
      'Content-Type': client.image.type
    }
  });
  // console.log(client.image)
}
export function removeClient(id) {
  return axios.delete(clientsURL + id);
}
// export function changeChartValue(chart) {
//     return axios.put(clientsURL + chart._id, chart);
// }
