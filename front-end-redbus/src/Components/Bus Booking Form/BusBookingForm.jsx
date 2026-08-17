import React from "react";
import Styles from "./BusBookingForm.module.css";
import { MdAccountCircle } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateBookingDetails } from "../../Redux/BookBus/action";
import { useTranslation } from "react-i18next";

const BusBookingForm = () => {
  const { t } = useTranslation();
  const seatsArray = useSelector((state) => state.busDetailsReducer.seats);

  var passengerArray = [];
  for (var ele = 0; ele < seatsArray.length; ele++) {
    passengerArray.push({
      name: "",
      age: "",
      gender: "",
    });
  }

  const [passDetails, setPassDetails] = React.useState(passengerArray);
  const [passEmail, setPassEmail] = React.useState("");
  const [passPhNo, setPassPhNo] = React.useState("");
  const [passIsBusiness, setPassIsBusiness] = React.useState(false);
  const [passIsCovidDonate, setPassIsCovidDonate] = React.useState(false);
  const [passInsurance, setPassInsurance] = React.useState(false);
  const [error, setError] = React.useState("");

  let navigate = useNavigate();
  let dispatch = useDispatch();
  const handleProceedToPay = () => {
    setError("");

    // Validation
    for (let i = 0; i < passDetails.length; i++) {
      if (!passDetails[i].name || passDetails[i].name.trim().length < 2) {
        setError(`Passenger ${i + 1}: Please enter a valid name`);
        return;
      }
      if (!passDetails[i].age || passDetails[i].age < 1 || passDetails[i].age > 100) {
        setError(`Passenger ${i + 1}: Age must be between 1 and 100`);
        return;
      }
      if (!passDetails[i].gender) {
        setError(`Passenger ${i + 1}: Please select gender`);
        return;
      }
    }

    if (!passEmail || !passEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!passPhNo || passPhNo.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    const payload1 = {
      key: "passengerDetails",
      value: passDetails,
    };

    const payload2 = {
      key: "email",
      value: passEmail,
    };

    const payload3 = {
      key: "phoneNumber",
      value: passPhNo,
    };

    const payload4 = {
      key: "isBusinessTravel",
      value: passIsBusiness,
    };

    const payload5 = {
      key: "isInsurance",
      value: passInsurance,
    };

    const payload6 = {
      key: "isCovidDonated",
      value: passIsCovidDonate,
    };

    dispatch(updateBookingDetails(payload1));
    dispatch(updateBookingDetails(payload2));
    dispatch(updateBookingDetails(payload3));
    dispatch(updateBookingDetails(payload4));
    dispatch(updateBookingDetails(payload5));
    dispatch(updateBookingDetails(payload6));

    navigate("/payment-page");
  };

  const handlePassName = (e, indexNo) => {
    const newArr = [...passDetails];
    newArr[indexNo]["name"] = e.target.value;
    setPassDetails(newArr);
  };

  const handlePassAge = (e, indexNo) => {
    const newArr = [...passDetails];
    newArr[indexNo]["age"] = e.target.value;
    setPassDetails(newArr);
  };

  const handlePassGender = (e, indexNo) => {
    const newArr = [...passDetails];
    newArr[indexNo]["gender"] = e.target.value;
    setPassDetails(newArr);
  };

  return (
    <div style={{ border: "1px solid black" }}>
      <h4 className={Styles.passenger_mainTitle}>{t('booking.passengerDetails')}</h4>
      {error && (
        <div style={{
          color: "#d84e55",
          backgroundColor: "#ffebee",
          padding: "10px",
          borderRadius: "4px",
          margin: "10px 20px",
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}
      <div
        style={{
          height: "500px",
          overflowY: "scroll",
          boxShadow: "0 0 4px 0 hsla(0, 0%, 64%, 0.5)",
        }}
      >
        {seatsArray.map((seatNo, index) => {
          return (
            <div className={Styles.ContentBlock}>
              <div className={Styles.passangerInfoTitle}>
                <MdAccountCircle style={{ fontSize: "25px", color: "teal" }} />
                <span style={{ marginLeft: "10px", marginTop: "2px" }}>
                  {t('booking.passengerInformation')}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "180px",
                  alignItems: "center",
                }}
              >
                <span>{t('booking.passenger')} {index + 1}</span>
                <div
                  style={{
                    height: "12px",
                    backgroundColor: "silver",
                    width: "2px",
                  }}
                ></div>
                <span>{t('booking.seat')} {seatNo}</span>
              </div>
              <div className={Styles.form_label}>{t('booking.passengerName')}</div>
              <input
                className={Styles.form_input}
                placeholder={t('booking.passengerName')}
                type="text"
                name="name"
                value={passDetails[index]["name"]}
                onChange={(e) => handlePassName(e, index)}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.form_label}>{t('booking.gender')}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginTop: "10px",
                    }}
                    onChange={(e) => handlePassGender(e, index)}
                  >
                    <input
                      className={Styles.radioButton}
                      type="radio"
                      name={"gender" + index}
                      value="Male"
                    />
                    <div className={Styles.form_radio_label}>{t('booking.male')}</div>
                    <input
                      className={Styles.radioButton}
                      type="radio"
                      name={"gender" + index}
                      value="Female"
                    />
                    <div className={Styles.form_radio_label}>{t('booking.female')}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.form_label}>{t('booking.age')}</div>
                  <input
                    className={Styles.form_input}
                    placeholder={t('booking.age')}
                    type="text"
                    name="age"
                    value={passDetails[index]["age"]}
                    onChange={(e) => handlePassAge(e, index)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={Styles.ContentBlock}>
        <div className={Styles.passangerInfoTitle}>
          <MdEmail style={{ fontSize: "25px", color: "#f1af43" }} />
          <span style={{ marginLeft: "10px", marginTop: "2px" }}>
            {t('booking.contactDetails')}
          </span>
        </div>
        <div className={Styles.passengerContactMsg}>
          {t('booking.ticketMessage')}
        </div>
        <div className={Styles.form_label}>{t('booking.email')}</div>
        <input
          className={Styles.form_input}
          placeholder={t('booking.email')}
          type="email"
          name="email"
          value={passEmail}
          onChange={(e) => setPassEmail(e.target.value)}
        />
        <div className={Styles.form_label}>{t('booking.phone')}</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            className={Styles.form_input}
            placeholder="+91"
            type="text"
            style={{ width: "50px", color: "#4f91d9" }}
          />
          <input
            className={Styles.form_input}
            placeholder={t('booking.phone')}
            type="number"
            name="phone"
            value={passPhNo}
            onChange={(e) => setPassPhNo(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <input
            type="checkbox"
            checked={passIsBusiness}
            onChange={(e) => setPassIsBusiness(e.target.checked)}
          />
          <div style={{ marginLeft: "10px" }}>
            I am booking tickets for business travel.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <input type="checkbox" />
          <FaWhatsapp
            style={{ color: "green", fontSize: "18px", marginLeft: "10px" }}
          />
          <div style={{ marginLeft: "10px" }}>
            Send updates and booking details on my Whatsapp number.
          </div>
        </div>
        <div className={Styles.insure_title}>
          Insure your travel by adding Rs 15 per passenger. Powered by 𝙄𝘾𝙄𝘾𝙄
          𝙇𝙤𝙢𝙗𝙖𝙧𝙙 𝙂𝙄𝘾 𝙇𝙩𝙙
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <img
              src="https://s1.rdbuz.com/apps/images/india-acko-insurance/luggage.png"
              alt="insurance"
              class="i-img"
              width="25"
              height="25"
            />
            <div>Loss of baggage</div>
            <div>Upto Rs. 3000 insurance cover</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              marginLeft: "40px",
              alignItems: "center",
            }}
          >
            <img
              src="https://s1.rdbuz.com/apps/images/india-acko-insurance/accident.png"
              alt="insurance"
              class="i-img"
              width="25"
              height="25"
            />
            <div>Personal Accident</div>
            <div>Rs. 6,00,000 insurance cover</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <input
            type="checkbox"
            checked={passInsurance}
            onChange={(e) => setPassInsurance(e.target.checked)}
          />
          <div style={{ marginLeft: "10px" }}>
            Yes , secure my trip with insuarnce , I have read and understood the
            Terms and conditions
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <input
            type="checkbox"
            checked={passIsCovidDonate}
            onChange={(e) => setPassIsCovidDonate(e.target.checked)}
          />
          <div style={{ marginLeft: "10px" }}>COVID Donation</div>
        </div>
      </div>
      <div className={Styles.ContentBlock}>
        <div>
          By clicking on proceed, I agree that I have read and understood the
          TnCs and the Privacy Policy
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <input
            className={Styles.proceed_to_button}
            type="submit"
            value="proceed to pay"
            onClick={handleProceedToPay}
          />
        </div>
      </div>
    </div>
  );
};

export default BusBookingForm;
