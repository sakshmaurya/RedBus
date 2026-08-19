import React from "react";
import styles from "./Coupon.module.css";
import { useTranslation } from "react-i18next";

const Coupon = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.couponContainer}>
      <div className={styles.flex}>
        <div className={styles.coupon}>
          <span>{t('coupon.saveUpTo')}</span>
          <span className={styles.offerImage}>
            <img
              src="https://st.redbus.in/Images/INDOFFER/safetyplus/274_147.png"
              alt={t('coupon.coupon1')}
            />
          </span>
          <span>{t('coupon.useCode')}</span>
        </div>
        <div className={styles.coupon}>
          <span>{t('coupon.saveUpTo')}</span>
          <span className={styles.offerImage}>
            <img
              src="https://s1.rdbuz.com/images/MobileOffers/amazon/offertile..png"
              alt={t('coupon.coupon1')}
            />
          </span>
          <span>{t('coupon.useCode')}</span>
        </div>
        <div className={styles.coupon}>
          <span>{t('coupon.saveUpTo')}</span>
          <span className={styles.offerImage}>
            <img
              src="https://st.redbus.in/Images/APSRTC/new/APSRTC_1.png"
              alt={t('coupon.coupon1')}
            />
          </span>
          <span>{t('coupon.useCode')}</span>
        </div>
      </div>
      {/* Floating Container */}
      <div className={styles.float}>
        <div className={styles.imgBox}>
          <img
            src="https://s3.rdbuz.com/Images/webplatform/measures/safetyplus.svg"
            alt="shield"
          />
        </div>
        <div className={styles.writingBox}>
          <h4>{t('safety.title')}</h4>
          <p>{t('safety.subtitle')}</p>
        </div>
        <div className={styles.buttonBox}>
          <div style={{ height: "50px" }}></div>
          <button>{t('safety.knowMore')}</button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
