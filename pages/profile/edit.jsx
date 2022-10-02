import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";

import Link from "../../view/components/Link";
import ChangePasswordModal from "../../view/ChangePasswordModal";

function ProfilePage({ userState }) {
  const [user, setUser] = userState;

  const {
    fullName,
    username,
    avatar,
    email = "",
    coffeeLove = 50,
    teaLove = 50,
  } = user;

  const [coffee, setCoffee] = useState(teaLove);
  const [tea, setTea] = useState(coffeeLove);
  const [name, setName] = useState(fullName);
  const [uname, setUname] = useState(username);
  const [mail, setMail] = useState(email);
  const [loading, setLoading] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const updatePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, password, confirmPassword } = e.target.elements;
    const data = {
      currentPassword: currentPassword.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };
    const result = await axios.post("/api/update-pwd", data);
    if (result.status === 200 && result.data.status) {
      toast.success(result.data.messages[0]);
    } else {
      result.data.messages.map((msg) => {
        toast.error(msg);
      });
    }
  };

  function handleUpdate(e) {
    e.preventDefault();
    const data = {
      fullName: name,
      username: uname,
      email: mail,
      coffeeLove: coffee,
      teaLove: tea,
    };
    setLoading(true);
    axios
      .post("/api/update-info", data)
      .then(function (res) {
        const { status, message, errors } = res.data;
        if (status) {
          toast.success(message);
          setUser(res.data.user);
          if (errors) errors.map((err) => toast.error(err));
        } else {
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className={`rounded-circle mt-5 avatar _${avatar}`}
              style={{ width: 150, height: 150 }}
            />
            <span>
              <Link to="/avatar" type="span">
                <button className="btn btn-primary btn-sm mt-3">
                  Change avatar
                </button>
              </Link>
            </span>
          </div>
        </div>

        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Edit your profile</h4>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <label className="labels">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Username</label>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <label className="labels">Email</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 py-5">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="customRange3" className="form-label coffee">
                  Love of Coffee
                </label>
                <input
                  onChange={(e) => {
                    setCoffee(e.target.value);
                  }}
                  className="form-range"
                  id="inputrange"
                  type="range"
                  value={coffee}
                  min="0"
                  max="100"
                />

                <span htmlFor="input-range" id="value2" className="range-value">
                  {coffee} 🤎
                </span>
              </div>
              <div className="col-md-6">
                <label htmlFor="customRange3" className="form-label tea">
                  Love of Tea
                </label>
                <input
                  onChange={(e) => {
                    setTea(e.target.value);
                  }}
                  className="form-range"
                  id="inputrange"
                  type="range"
                  value={tea}
                  min="0"
                  max="100"
                />

                <span htmlFor="input-range" id="value2" className="range-value">
                  {tea} 💚
                </span>
              </div>
            </div>
            <br />

            <br />
            <div className="col-md-12">
              <button
                className="btn btn-danger profile-button"
                type="button"
                onClick={() => setShowPasswordModal(true)}
              >
                Change your password
              </button>
              <ChangePasswordModal
                showState={[showPasswordModal, setShowPasswordModal]}
                onSumbit={updatePassword}
              />
            </div>
          </div>
        </div>

        <div className="mb-5 text-center">
          <button
            className="btn save-button profile-button"
            type="button"
            disabled={loading}
            onClick={handleUpdate}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
