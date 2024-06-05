import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineKey,
  AiOutlineExclamationCircle,
} from "react-icons/ai"; // Import icons
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import "./MedicalForm.css"; // Import CSS for styling

function MedicalForm() {
  const [isMedicalNumberValid, setIsMedicalNumberValid] = useState(false);
  const [medicalNumber, setMedicalNumber] = useState("");
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [token, setToken] = useState(""); // Add state for token
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track form submission
  const [isFormCompleted, setIsFormCompleted] = useState(false); // New state to track form completion
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Submit");
  const [isClicked, setIsClicked] = useState(false);

  
  

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setError(null);
    }, 4000);

    return () => clearTimeout(errorTimer);
  }, [error]);

  const handleClick = () => {
    // اگر کلیک شده است، متن دکمه به "تلاش مجدد" تغییر می‌یابد
    setButtonText(" Retry");
    // وضعیت کلیک را به true تغییر می‌دهیم
    setIsClicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicalNumber) {
      setError("Please enter a medical number.");
      setUserData([]);
      setShowVerification(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://karkhone-new.cube10.io/wp-json/my-api/v1/patients?medical_number=${medicalNumber}`
      );

      if (response.data.length > 0) {
        const filteredUserData = response.data.filter(
          (user) => user.medical_number === medicalNumber
        );
        setUserData(filteredUserData);
        setError(null);

        setShowVerification(true);
        await sendVerificationSMS(filteredUserData[0].mobile_number);

        // Check if medical number is valid after receiving response
        setIsMedicalNumberValid(true);
      } else {
        setError("User not found");
        setUserData([]);
        setShowVerification(false);
        setIsMedicalNumberValid(false); // Set medical number to invalid
      }
    } catch (error) {
      setError("Something went wrong!");
      setUserData([]);
      setShowVerification(false);
      setIsMedicalNumberValid(false); // Set medical number to invalid
    }

    setIsSubmitted(true); // Update the state after form submission
  };

  const sendVerificationSMS = async (mobileNumber) => {
    try {
      const message = "Your verification code is: " + verificationCode;
      const smsResponse = await axios.post(
        "https://karkhone-new.cube10.io/wp-json/sms/v1/send",
        {
          mobile: mobileNumber,
          message: message,
        }
      );
      console.log(smsResponse.data);
      setSmsSent(true);
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        `https://karkhone-new.cube10.io/wp-json/sms/v1/data`
      );
      const codes = response.data.map((item) => item.code);
      if (codes.includes(verificationCode)) {
        const newToken = uuidv4(); // Generate a new token
        setToken(newToken); // Save the token in state
        localStorage.setItem("token", newToken); // Save the token in local storage
        navigate("/home", { state: { userData: userData } });
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      console.error("Error checking verification code:", error);
      setError("Something went wrong!");
    }
  };

  useEffect(() => {
    setIsLoginDisabled(verificationCode.length !== 6);
  }, [verificationCode]);

  useEffect(() => {
    if (userData.length > 0 && isSubmitted) {
      setIsFormCompleted(true);
    }
  }, [userData, isSubmitted]);

  return (
    <div className="login-container">
      <div className="vontiner-flex">
        <div className="imag-login">
          <div className="img-box">
            <img  src="https://nestle.rulescout.com/static/media/img.47c9c9a72a11e977cdf0.png" className="img2" />
            <div className="text-logo"></div>
          </div>
        </div>
        <div className="login-my">
          <div className="login-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="medicalNumber">Medical Number</label>
                <div className="input-icon">
                  <AiOutlineUser />
                  <input
                    type="text"
                    id="medicalNumber"
                    value={medicalNumber}
                    onChange={(e) => setMedicalNumber(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="submit-btn"
                style={{ display: !isMedicalNumberValid ? "block" : "none" }}
                onClick={handleClick}
              >
                {buttonText}
              </button>{" "}
            </form>

            {showVerification && (
              <div>
                <div className="input-group">
                  <label htmlFor="verificationCode">Verification Code</label>
                  <div className="input-icon">
                    <AiOutlineKey />
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            )}

            {showVerification && (
              <button
                onClick={handleLogin}
                disabled={isLoginDisabled}
                className="login-btn"
              >
                Login
              </button>
            )}

            {smsSent && (
              <p className="message success-message">
                <AiOutlineExclamationCircle /> Verification code sent via SMS.
              </p>
            )}

            {error && (
              <p className="message error-message">
                <AiOutlineExclamationCircle /> {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}




export default MedicalForm;
