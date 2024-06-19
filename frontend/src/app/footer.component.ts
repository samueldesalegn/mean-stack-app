import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="footer-content">
        <div class="footer-section support">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help center</a></li>
            <li><a href="#">Sitemap</a></li>
            <li><a href="#">Contact us</a></li>
          </ul>
        </div>
        <div class="footer-section about">
          <h4>About</h4>
          <ul>
            <li><a href="#">About Drugs.com</a></li>
            <li><a href="#">Advertising policy</a></li>
            <li><a href="#">Attribution & citations</a></li>
          </ul>
        </div>
        <div class="footer-section terms">
          <h4>Terms & privacy</h4>
          <ul>
            <li><a href="#">Editorial policy</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms of use</a></li>
          </ul>
        </div>
        <div class="footer-section social">
          <h4>Subscribe</h4>
          <p>
            Subscribe to Drugs.com newsletters for the latest medication news,
            new drug approvals, alerts and updates.
          </p>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-pinterest"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
            <a href="#"><i class="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          Drugs.com provides accurate and independent information on more than
          24,000 prescription drugs, over-the-counter medicines and natural
          products. This material is provided for educational purposes only and
          is not intended for medical advice, diagnosis or treatment. Data
          sources include Micromedex (updated 4 Jun 2024), Cerner Multum™
          (updated 3 Jun 2024), ASHP (updated 10 Jun 2024) and others.
        </p>        
        <p>Copyright © 2000-2024 Drugs.com. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      footer {
        background-color: #f8f8f8;
        padding: 2rem 1rem;
        border-top: 1px solid #e7e7e7;
        margin-top: 2rem;
      }
      .footer-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 2rem;
      }
      .footer-section {
        flex: 1;
      }
      .footer-section h4 {
        margin-bottom: 1rem;
      }
      .footer-section ul {
        list-style: none;
        padding: 0;
      }
      .footer-section ul li {
        margin-bottom: 0.5rem;
      }
      .footer-section ul li a {
        text-decoration: none;
        color: #333;
      }
      .footer-section ul li a:hover {
        text-decoration: underline;
      }
      .social-icons {
        display: flex;
        gap: 1rem;
      }
      .social-icons a {
        color: #333;
        font-size: 1.5rem;
      }
      .footer-bottom {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e7e7e7;
      }
      .footer-bottom p {
        margin: 0.5rem 0;
      }
      .footer-logos {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
      }
      .footer-logos img {
        height: 50px;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent {}
