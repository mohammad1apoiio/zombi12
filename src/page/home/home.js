import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./home.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoader from "../../components/Skeleton-loader/SkeletonLoader";
import Loader from "../../components/loder/loader";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state.userData;
  const [editedUserData, setEditedUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : userData[0];
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [medicalData, setMedicalData] = useState({ medical_number: "" });
  useEffect(() => {
    // simulate data fetching
    setTimeout(() => {
      setMedicalData({ medical_number: "123456" });
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("You need to login!"); // نمایش پیام خطا با استفاده از toast
      navigate("/"); // هدایت کاربر به صفحه لاگین
    }
  }, []);

  // وضعیت اولیه آن false است

  useEffect(() => {
    // localStorage.setItem("userData", JSON.stringify(editedUserData));
  }, [editedUserData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const handleCheckboxChange = () => {
    // تعریف تابع handleCheckboxChange
    setIsChecked(!isChecked);
  };

  const handleSave = () => {
    localStorage.removeItem("userData");

    // تنظیم مقدار verified به true
    const updatedUserData = { ...editedUserData, verified: true };

    axios
      .post(
        "https://karkhone-new.cube10.io/wp-json/my-api/v1/patients",
        updatedUserData
      )
      .then((response) => {
        console.log("Data saved successfully!");
        setSuccessMessage("Data saved successfully!");

        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="cont-btn">
        <div className="cont-btn-wel">
          <h1 className="heading">
            Welcome {editedUserData.first_name} {editedUserData.last_name}
          </h1>
        </div>
        <div className="btn-log">
          <div className="btn-loguot">
            <button
              type="button"
              className="logoutButton"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="form-hed">
        <div className="formss">
          <div className="forms-hed">
            <h2>Profile</h2>
          </div>
          <div className="formContainer">
            {successMessage && (
              <div className="successMessage">{successMessage}</div>
            )}
            {editedUserData && (
              <form className="forms">
                <div className="form-fild-old ">
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">Medical Number:</label>
                    )}
                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        value={editedUserData.medical_number}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">First Name:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        name="first_name"
                        value={editedUserData.first_name}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">Last Name:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        name="last_name"
                        value={editedUserData.last_name}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">Email:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="email"
                        name="email"
                        value={editedUserData.email}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="agri mobail-h">
                    <label className="formLabel">Agree to terms:</label>
                    <div className="radio">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />{" "}
                      <p className="p-radio">
                        Are you sure the information is correct?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="form-fild-old">
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">State:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        name="state"
                        value={editedUserData.state}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">City:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        name="city"
                        value={editedUserData.city}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">Address:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="text"
                        name="address"
                        value={editedUserData.address}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>

                  <div className="formField">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <label className="formLabel">Mobile Number:</label>
                    )}

                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <input
                        className="formInput"
                        type="tel"
                        name="mobile_number"
                        value={editedUserData.mobile_number}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                  <div className="agri dekstop-h">
                    <label className="formLabel">Agree to terms:</label>
                    <div className="radio">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />{" "}
                      <p className="p-radio">
                        Are you sure the information is correct?
                      </p>
                    </div>
                  </div>
                  <div className="btn-save">
                    <div>
                      <button
                        type="button"
                        className={`saveButton ${isChecked ? "" : "disabled"}`}
                        onClick={handleSave}
                        disabled={!isChecked}
                        title={
                          !isChecked
                            ? "Activate the Agree to terms option!"
                            : ""
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="azmon">
          <div className="azmon-hed">{/* <h2>Survey</h2> */}</div>
          <div className="azmon-body">
            {/* <Survey /> */}
            <img
              className="img"
              src="https://nestle.rulescout.com/static/media/img.47c9c9a72a11e977cdf0.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
