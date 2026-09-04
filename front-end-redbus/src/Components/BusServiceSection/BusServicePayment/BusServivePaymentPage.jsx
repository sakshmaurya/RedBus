import React, { useState } from "react";
import Styles from "./BusPayment.module.css";
import { MdAccountCircle } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const currentCustomer = useSelector(
    (state) => state.authReducer.currentCustomer
  );
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const pickUp = query.get("pickUp");
  const drop = query.get("drop");
  const pickUpDate = query.get("pickUpDate");
  const dropDate = query.get("dropDate");
  const totalPassengers = query.get("totalPassengers");
  const price = query.get("price");
  const email = query.get("email");
  // stripe make payment end
  const bookingHireObj = {
    pickUp,
    drop,
    pickUpDate,
    dropDate,
    totalPassengers,
    email,
    fare: price * 500,
  };
  // stripe make payment start
  const [product] = React.useState({
    name: "React from facebook",
    price: 10,
    productBy: "Facebook",
  });
  const navigate = useNavigate();

  // Mock payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (cardDetails.cardNumber.length < 16) {
      alert("Please enter a valid card number");
      return;
    }
    if (cardDetails.expiry.length < 5) {
      alert("Please enter a valid expiry date (MM/YY)");
      return;
    }
    if (cardDetails.cvv.length < 3) {
      alert("Please enter a valid CVV");
      return;
    }
    if (cardDetails.name.length < 3) {
      alert("Please enter cardholder name");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create booking after "payment"
    await makePayment();
  };

  const makePayment = async () => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/bookingHire`,
        bookingHireObj
      );
      alert("Payment successful! Bus hire booking confirmed.");
      navigate("/my-profile");
    } catch (err) {
      console.log("Error creating booking:", err);
      alert("Error creating booking. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* Full Container */}
      <div className={Styles.payment__fullContainer}>
        {/* left Container */}
        <div className={Styles.payment__fullContainer_leftContainer}>
          <input
            className={
              Styles.payment__fullContainer_rightContainer_inputOfferCOde
            }
            placeholder="ENTER OFFER CODE"
          />
          <div className={Styles.payment__fullContainer_rightContainer_infobar}>
            <div className={Styles.banner_chip}>
              <img
                src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/safe-payments.svg"
                alt="CC"
              />
              <div className={Styles.banner_text}>
                <div>Safe and Secure</div>
                <div>Online Payments</div>
              </div>
            </div>
            <div className={Styles.banner_chip}>
              <img
                src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/transactions.svg"
                alt="Million Transactions"
              />
              <div className={Styles.banner_text}>
                <div>60+ million</div>
                <div>transactions</div>
              </div>
            </div>
            <div className={Styles.banner_chip}>
              <img
                src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/trust.svg"
                alt="Reliable"
              />
              <div className={Styles.banner_text}>
                <div>10+ years of</div>
                <div>Trust</div>
              </div>
            </div>
          </div>
          <div
            className={
              Styles.payment__fullContainer_leftContainer_paymentInstruments
            }
          >
            {!showPaymentForm ? (
              <div className={Styles.Payment__stripe}>
                <button
                  className={Styles.Payment__stripe__button}
                  onClick={() => setShowPaymentForm(true)}
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <div className={Styles.paymentFormContainer}>
                <h3 className={Styles.paymentFormTitle}>Enter Card Details</h3>
                <form onSubmit={handlePaymentSubmit} className={Styles.paymentForm}>
                  <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Card Number</label>
                    <input
                      type="text"
                      className={Styles.formInput}
                      placeholder="4242 4242 4242 4242"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className={Styles.formRow}>
                    <div className={Styles.formGroup}>
                      <label className={Styles.formLabel}>Expiry Date</label>
                      <input
                        type="text"
                        className={Styles.formInput}
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          setCardDetails({...cardDetails, expiry: value});
                        }}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className={Styles.formGroup}>
                      <label className={Styles.formLabel}>CVV</label>
                      <input
                        type="text"
                        className={Styles.formInput}
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Cardholder Name</label>
                    <input
                      type="text"
                      className={Styles.formInput}
                      placeholder="Name on card"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className={Styles.formButtons}>
                    <button
                      type="button"
                      className={Styles.cancelButton}
                      onClick={() => setShowPaymentForm(false)}
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={Styles.Payment__stripe__button}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : `Pay Rs. ${price * 500}`}
                    </button>
                  </div>
                  <p className={Styles.testCardHint}>
                    💡 Test with card: 4242 4242 4242 4242, any future date, any 3-digit CVV
                  </p>
                </form>
              </div>
            )}
            <div className={Styles.choose_payment_heading}>
              Choose Payment Method
            </div>
            <div
              className={
                Styles.payment__fullContainer_leftContainer_paymentInstrument
              }
            >
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>Credit Card</div>
                <div className={Styles.paymentIconList}>
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/mobile/v2/visa.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/mobile/v2/mastercard.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/maestro.png"
                    alt=""
                  />
                </div>
              </div>
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>Debit Card</div>
                <div className={Styles.paymentIconList}>
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/mobile/v2/visa.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/mobile/v2/mastercard.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/maestro.png"
                    alt=""
                  />
                </div>
              </div>
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>Wallets</div>
                <img
                  className={Styles.payment_icon_img}
                  src="https://st.redbus.in/paas/images/web/v2/amazonpay.png"
                  alt=""
                />
              </div>
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>Net Banking</div>
                <div className={Styles.paymentIconList}>
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/axis.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/sbi.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/hdfc.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/icici.png"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/kotak.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div className={Styles.UpiPaymentText}>
              UPI PAYMENT USING PHONEPAY / GPAY / AMAZONPAY ETC...
            </div>
            <div
              className={
                Styles.payment__fullContainer_leftContainer_paymentInstrument
              }
            >
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>
                  Pay through QR Code
                </div>
                <div
                  className={
                    Styles.payment__fullContainer_leftContainer_eachPaymentInstruments_new
                  }
                >
                  New
                </div>
                <div className={Styles.paymentIconList}>
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/gpay.svg"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/phonepe.svg"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/amazonpay.svg"
                    alt=""
                  />
                </div>
              </div>
              <div
                className={
                  Styles.payment__fullContainer_leftContainer_eachPaymentInstruments
                }
              >
                <input className={Styles.radioButton} type="radio" />
                <div className={Styles.radioButtonText}>Pay through UPI ID</div>
                <div
                  className={
                    Styles.payment__fullContainer_leftContainer_eachPaymentInstruments_new
                  }
                >
                  New
                </div>
                <div className={Styles.paymentIconList}>
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/gpay.svg"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/phonepe.svg"
                    alt=""
                  />
                  <img
                    className={Styles.payment_icon_img}
                    src="https://st.redbus.in/paas/images/web/v2/upi/amazonpay.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* right Container */}
        <div className={Styles.payment__fullContainer_rightContainer}>
          <div
            className={
              Styles.payment__fullContainer_rightContainer_trip_container
            }
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <MdDateRange className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>
                    Pick Up Date
                  </div>
                  <div style={{ display: "flex", width: "150px" }}>
                    <div>{pickUpDate}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.line}></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <MdDateRange className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>Return Date</div>
                  <div style={{ display: "flex", width: "150px" }}>
                    <div>{dropDate}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.line}></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <MdDateRange className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>
                    Total Passengers
                  </div>
                  <div style={{ display: "flex", width: "150px" }}>
                    <div>{totalPassengers}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.line}></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <VscLocation className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>
                    Pick Up Location
                  </div>
                  <div>{pickUp}</div>
                  <div>{pickUpDate}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className={Styles.travel_specification}>
                  Dropping Location
                </div>
                <div>{drop}</div>
                <div>{dropDate}</div>
              </div>
            </div>
            <div className={Styles.passangerInfo}>
              <MdAccountCircle className={Styles.icons} />
              <div className={Styles.passangerName}>
                {currentCustomer ? currentCustomer.name : "Nitansh"}
              </div>
            </div>
          </div>
          <div
            className={
              Styles.payment__fullContainer_rightContainer_fair_container
            }
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className={Styles.travel_title}>FARE BREAKUP</div>
              <img
                src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/down.svg"
                width="14"
                height="14"
                alt=""
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div
                className={Styles.travel_specification}
                style={{ fontWeight: "bold" }}
              >
                Total Payable
              </div>
              <div
                className={Styles.travel_specification}
                style={{ fontWeight: "bold" }}
              >
                {price * 500}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
              width: "95%",
            }}
          >
            <img
              className={Styles.payment_banner_icon_img}
              src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/master-card-secure-code.png"
              alt=""
            />
            <img
              className={Styles.payment_banner_icon_img}
              src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/verified-by-visa.svg"
              alt=""
            />
            <img
              className={Styles.payment_banner_icon_img}
              src="https://s3.rdbuz.com/Images/webplatform/Common/Payment/verisign-secured.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payment;
