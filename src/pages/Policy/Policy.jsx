import React from 'react';
import './Policy.css';

const Policy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <aside className="policy-sidebar">
          <h3>Contents</h3>
          <ul>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#refund">Refund Policy</a></li>
            <li><a href="#allergen">Allergen & Nutrition</a></li>
            <li><a href="#delivery">Delivery Policy</a></li>
          </ul>
        </aside>

        <main className="policy-content">
          <header className="policy-header">
            <h1>Legal & Policy Information</h1>
            <p>Last Updated: March 2026</p>
          </header>

          <section id="terms" className="policy-section">
            <div className="section-number">01</div>
            <h2>Terms & Conditions</h2>
            <div className="section-content">
              <p>
                By using our website or services, you agree to our terms and conditions.
                These include compliance with local laws, responsible ordering, and
                refraining from misuse of the platform. We reserve the right to
                update or change these terms at any time without prior notice.
              </p>
            </div>
          </section>

          <section id="privacy" className="policy-section">
            <div className="section-number">02</div>
            <h2>Privacy Policy</h2>
            <div className="section-content">
              <p>
                We respect your privacy and are committed to protecting your personal
                data. We collect only necessary information to process your orders and
                improve our services. We never sell your data to third parties.
              </p>
            </div>
          </section>

          <section id="refund" className="policy-section">
            <div className="section-number">03</div>
            <h2>Refund & Cancellation Policy</h2>
            <div className="section-content">
              <p>
                Orders can be cancelled within 5 minutes of placement for a full refund.
                After preparation has begun, refunds are not guaranteed. If you receive
                an incorrect or defective order, please contact us within 24 hours.
              </p>
            </div>
          </section>

          <section id="allergen" className="policy-section">
            <div className="section-number">04</div>
            <h2>Allergen & Nutrition Disclaimer</h2>
            <div className="section-content">
              <p>
                Our dishes may contain allergens such as nuts, dairy, gluten, and soy.
                While we take steps to minimize cross-contamination, we cannot
                guarantee an allergen-free environment. Nutritional information is
                approximate and may vary.
              </p>
            </div>
          </section>

          <section id="delivery" className="policy-section">
            <div className="section-number">05</div>
            <h2>Delivery Policy</h2>
            <div className="section-content">
              <p>
                We aim to deliver all orders within the estimated time frame provided
                at checkout. However, delays may occur due to traffic, weather, or
                unforeseen circumstances. Delivery fees are non-refundable.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Policy;
