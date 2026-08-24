
import React from 'react'
import Styles from './busHireFooter.module.css'
import { useTranslation } from 'react-i18next';

const BusHireFooter = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className={Styles.busHire_Footer}>
                <div className={Styles.busHireFooterTextSection}>
                    <div className={Styles.busHireFooterEachTextSection}>
                        <h3>{t('footer.book')}</h3>
                        <p>{t('footer.busTicket')}</p>
                        <p>{t('footer.busHire')}</p>
                        <p>{t('footer.tempoTravellers')}</p>
                        <p>{t('footer.carRentals')}</p>
                    </div>
                    <div className={Styles.busHireFooterEachTextSection}>
                        <h3>{t('footer.about')}</h3>
                        <p>{t('footer.aboutUs')}</p>
                        <p>{t('footer.contactUs')}</p>
                    </div>
                    <div className={Styles.busHireFooterEachTextSection}>
                        <h3>{t('footer.info')}</h3>
                        <p>{t('footer.tAndC')}</p>
                        <p>{t('footer.privacyPolicy')}</p>
                        <p>{t('footer.cookiePolicy')}</p>
                        <p>{t('footer.faq')}</p>
                    </div>
                    <div className={Styles.busHireFooterEachTextSection}>
                        <h3>{t('footer.globalSites')}</h3>
                        <p>{t('footer.india')}</p>
                        <p>{t('footer.singapore')}</p>
                        <p>{t('footer.malaysia')}</p>
                        <p>{t('footer.indonesia')}</p>
                        <p>{t('footer.peru')}</p>
                        <p>{t('footer.colombia')}</p>
                    </div>
                    <div className={Styles.busHireFooterEachTextSection}>
                        <h3>{t('footer.ourPartners')}</h3>
                        <p>{t('footer.goibibo')}</p>
                        <p>{t('footer.makemytrip')}</p>
                    </div>
                </div>
                <div className={Styles.busHireFooterimageSection}>
                    <div><img src="https://www.redbus.in/bushire/static/mwebv2/header/logo_rb.svg" alt="" /></div>
                    <div className={Styles.copyRightText}>{t('footer.copyright')}</div>

                </div>
            </div>
        </div>
    )
}

export default BusHireFooter
