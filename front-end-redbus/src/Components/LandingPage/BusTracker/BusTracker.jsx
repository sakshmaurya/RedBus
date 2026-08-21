import React from "react";
import styles from "./BusTracker.module.css";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

const BusTracker = () => {
  const { t } = useTranslation();
  const data = [
    {
      type: t('trackBus.buses'),
      number: t('trackBus.busesCount'),
      details: t('trackBus.busesDesc'),
    },
    {
      type: t('trackBus.routes'),
      number: t('trackBus.routesCount'),
      details: t('trackBus.routesDesc'),
    },
    {
      type: t('trackBus.users'),
      number: t('trackBus.usersCount'),
      details: t('trackBus.usersDesc'),
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.upperFlexContainer}>
        <div className={styles.imgBox}>
          <img
            src="https://s3.rdbuz.com/Images/carousel/tmb_img.png"
            alt="tracker"
          />
        </div>
        <div className={styles.writingBox}>
          <h2>{t('trackBus.title')}</h2>
          <p>
            {t('trackBus.description')}
          </p>
          <Button variant="outlined" color="primary">
            {t('safety.knowMore2')}
          </Button>
        </div>
      </div>

      <hr />
      <div className={styles.flexContainer}>
        {data.map((item) => {
          return (
            <div key={uuidv4()} className={styles.flexItems}>
              <p>{item.type}</p>
              <h1>{item.number}</h1>
              <p>{item.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusTracker;
