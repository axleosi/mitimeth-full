import React from 'react'
import styles from './Footer.module.css'
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa"; 
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.con}>
        <div className={styles.imageMCon}>
            <img src='/logo.jpeg' className={styles.logo}/>
            <div className={styles.links}>
              <Link href='/' className={styles.link}>HOME</Link>
              <Link href='/shop' className={styles.link}>SHOP</Link>
              <Link href='/blog' className={styles.link}>BLOG</Link>
              <Link href='/artisans' className={styles.link}>ARTISANS</Link>
            </div>
            <div className={styles.imageCon}>
              <Link href='https://www.instagram.com/mitimeth.ng/'><FaInstagram className={styles.image}/></Link>
              <Link href='https://x.com/i/flow/login?redirect_after_login=%2Fi%2Fflow%2Flogin'></Link><FaTwitter className={styles.image}/>
              <Link href='https://ng.linkedin.com/company/mitimeth#:~:text=MitiMeth%20|%20741%20followers%20on%20LinkedIn.'><FaLinkedin className={styles.image}/></Link>
              <Link href='https://www.facebook.com/mitimethmade/'><FaFacebook className={styles.image}/></Link>
            </div>
        </div>
        <p>2024. All Rights Reserved</p>
    </div>
  )
}

export default Footer