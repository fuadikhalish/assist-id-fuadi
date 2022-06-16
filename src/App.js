import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React from "react";

function getData() {
  $("#tb tr").remove()
  let i = 1;
  $.ajax({
    url: " https://61601920faa03600179fb8d2.mockapi.io/pegawai",
    method: "GET",
    success: function (resp) {
      resp.forEach((e) => {
        let x = `
        <tr>
        <td>${i++}</td>
        <td>${e.nama}</td>
        <td>${e.provinsi}</td>
        <td>${e.kabupaten}</td>
        <td>${e.kelurahan}</td>
        <td>${e.kecamatan}</td>
        <td class="text-center">
          <Button class="btn btn-success btn-edit" data-id="${e.id}">Edit</Button>
          <Button class="btn btn-danger btn-delete" data-id="${e.id}">Delete</Button>
        </td>
      </tr>
        `;
        $("#tb").append(x);
      });
    },
  });
}

function submitData() {
  let url = ''
  let method = ''
  if($('#id').val()){
    url = "https://61601920faa03600179fb8d2.mockapi.io/pegawai/" + $('#id').val();
    method = "PUT";
  } else {
    url = "https://61601920faa03600179fb8d2.mockapi.io/pegawai";
    method = "POST";
  }
  $.ajax({
    url: url,
    method: method,
    data: {
      nama: $("#nama").val(),
      provinsi: $("#provinsi").val(),
      kabupaten: $("#kabupaten").val(),
      kecamatan: $("#kecamatan").val(),
      kelurahan: $("#kelurahan").val(),
    },
    success: function () {
      console.log("success!");
    },
    error: function () {
      console.log("error!");
    },
  });
}

//delete data
$(document).on("click", ".btn-delete", function () {
  let id = $(this).attr("data-id");
  if (window.confirm("r u sure?") == true) {
    $.ajax({
      url: `https://61601920faa03600179fb8d2.mockapi.io/pegawai/${id}`,
      method: "DELETE",
    }).then(function () {
      window.location.reload();
    });
  }
});



function getApiIndo(mode, id) {
  let url = null;
  if (mode == "prov") {
    url = "https://dev.farizdotid.com/api/daerahindonesia/provinsi";
  } else if (mode == "kab") {
    url =
      "https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=" + id;
  } else if (mode == "kec") {
    url =
      "https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=" + id;
  } else {
    url =
      "https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=" +
      id;
  }

  const data = [];
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (resp) {
      if (mode == "prov") {
        resp.provinsi.forEach((e) => {
          data.push(e);
        });
      } else if (mode == "kab") {
        resp.kota_kabupaten.forEach((e) => {
          data.push(e);
        });
      } else if (mode == "kec") {
        resp.kecamatan.forEach((e) => {
          data.push(e);
        });
      } else {
        resp.kelurahan.forEach((e) => {
          data.push(e);
        });
      }
    },
  });
  return data;
}

class GetLoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_provinsi: "",
      id_kota: "",
      id_kecamatan: "",
    };
  }

  render() {
    let prov = getApiIndo("prov", null);
    let kab = getApiIndo("kab", this.state.id_provinsi);
    let kec = getApiIndo("kec", this.state.id_kota);
    let kel = getApiIndo("kel", this.state.id_kecamatan);
    return (
      <div>
        <Form.Group className="mb-3">
          <Autocomplete
            disablePortal
            id="select-prov"
            options={prov}
            getOptionLabel={(option) => option.nama}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Provinsi" />}
            onChange={(event, newValue) => {
              let val = JSON.stringify(newValue, null, " ");
              this.setState({ id_provinsi: JSON.parse(val).id });
              $("#provinsi").val(JSON.parse(val).nama);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Autocomplete
            disablePortal
            id="select-kab"
            options={kab}
            getOptionLabel={(option) => option.nama}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Kabupaten" />
            )}
            onChange={(event, newValue) => {
              let val = JSON.stringify(newValue, null, " ");
              this.setState({ id_kota: JSON.parse(val).id });
              $("#kabupaten").val(JSON.parse(val).nama);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Autocomplete
            disablePortal
            id="select-kec"
            options={kec}
            getOptionLabel={(option) => option.nama}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Kecamatan" />
            )}
            onChange={(event, newValue) => {
              let val = JSON.stringify(newValue, null, " ");
              this.setState({ id_kecamatan: JSON.parse(val).id });
              $("#kecamatan").val(JSON.parse(val).nama);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Autocomplete
            disablePortal
            id="select-kel"
            options={kel}
            getOptionLabel={(option) => option.nama}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Kelurahan" />
            )}
            onChange={(event, newValue) => {
              let val = JSON.stringify(newValue, null, " ");
              this.setState({ id_kecamatan: JSON.parse(val).id });
              $("#kelurahan").val(JSON.parse(val).nama);
            }}
          />
        </Form.Group>
      </div>
    );
  }
}

function App() {
  const [id, setIdPegawai] = useState();


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  $(document).on('click', '.btn-edit', function(){
    setIdPegawai($(this).attr('data-id'))
    handleShow()
  })

  getData();
  return (
    <div>
      <div className="container">
        <div>
          <Button
            onClick={handleShow}
            style={{ marginBottom: "10px", marginTop: "20px" }}
          >
            Tambah Data
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Provinsi</th>
              <th>Kabupaten</th>
              <th>Kelurahan</th>
              <th>Kecamatan</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tb"></tbody>
        </Table>
      </div>

      <Modal id="main-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <input type={"hidden"} id="provinsi"></input>
            <input type={"hidden"} id="kabupaten"></input>
            <input type={"hidden"} id="kecamatan"></input>
            <input type={"hidden"} id="kelurahan"></input>
            <input type={"hidden"} id="id" value={id}></input>
            <Form.Group className="mb-3">
              <Form.Control style={{height: "55px"}} id="nama" type="text" placeholder="Nama Pegawai"/>
            </Form.Group>
            <GetLoc />
            <div style={{ textAlign: "right" }}>
              <Button
                style={{ marginRight: "10px" }}
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
              <button className="btn btn-primary" type="submit" id="btn-submit" onClick={submitData}>
                Submit
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
