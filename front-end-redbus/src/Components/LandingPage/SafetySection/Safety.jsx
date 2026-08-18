import React from "react";
import styles from "./Safety.module.css";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

const Safety = () => {
  const { t } = useTranslation();
  const arr = [
    {
      heading: t('safety.sanitizedBus'),
      descriptions: t('safety.sanitizedBusDesc'),
    },
    {
      heading: t('safety.mandatoryMasks'),
      descriptions: t('safety.mandatoryMasksDesc'),
    },
    {
      heading: t('safety.thermalScreening'),
      descriptions: t('safety.thermalScreeningDesc'),
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.imgBox}>
        <img
          src="https://s3.rdbuz.com/Images/webplatform/measures/safetyplus.svg"
          alt="shield"
        />
      </div>
      <div className={styles.writingConatiner}>
        <h2>{t('safety.title')}</h2>
        <h3>{t('safety.optToTravel')}</h3>
        <span
          style={{ color: "blue", display: "inline-block", marginLeft: "14px" }}
        >
          {t('safety.knowMore2')}
        </span>
        <p>
          {t('safety.lookForBuses')}
        </p>
        <div className={styles.lowerFlex}>
          {arr.map((item) => {
            return (
              <div key={uuidv4()} className={styles.lowerFlexItems}>
                <h3>{item.heading}</h3>
                <p>{item.descriptions}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Safety;
