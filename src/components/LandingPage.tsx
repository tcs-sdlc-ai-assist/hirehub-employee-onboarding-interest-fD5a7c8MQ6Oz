import React from 'react';
import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    emoji: '🚀',
    title: 'Innovation',
    description:
      'Work on cutting-edge projects that push boundaries and shape the future of technology.',
  },
  {
    emoji: '📈',
    title: 'Growth',
    description:
      'Accelerate your career with mentorship programs, learning resources, and clear advancement paths.',
  },
  {
    emoji: '🤝',
    title: 'Culture',
    description:
      'Join a diverse, inclusive team that values collaboration, creativity, and work-life balance.',
  },
  {
    emoji: '🌍',
    title: 'Impact',
    description:
      'Make a meaningful difference by contributing to products used by millions around the world.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleApplyNow = (): void => {
    navigate('/apply');
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroHeading}>Welcome to HireHub</h1>
        <p style={styles.heroSubheading}>
          Discover a workplace where innovation thrives, talent is nurtured, and
          every voice matters. At HireHub, we believe in building a culture that
          empowers you to do the best work of your life.
        </p>
        <button
          type="button"
          style={styles.ctaButton}
          onClick={handleApplyNow}
        >
          Apply Now
        </button>
      </section>

      {/* Why Join Us Section */}
      <section style={styles.whyJoinSection}>
        <h2 style={styles.sectionHeading}>Why Join Us?</h2>
        <div style={styles.cardsGrid}>
          {featureCards.map((card) => (
            <div key={card.title} style={styles.card}>
              <span style={styles.cardEmoji}>{card.emoji}</span>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomCtaHeading}>Ready to Join?</h2>
        <p style={styles.bottomCtaText}>
          Take the first step toward an exciting career. We'd love to hear from
          you.
        </p>
        <button
          type="button"
          style={styles.ctaButton}
          onClick={handleApplyNow}
        >
          Apply Now
        </button>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    marginTop: '2rem',
    color: '#ffffff',
  },
  heroHeading: {
    fontSize: '2.5rem',
    fontWeight: 700,
    margin: '0 0 1rem 0',
    color: '#ffffff',
  },
  heroSubheading: {
    fontSize: '1.125rem',
    lineHeight: 1.7,
    maxWidth: '700px',
    margin: '0 auto 2rem auto',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ctaButton: {
    padding: '0.875rem 2.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#e63946',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  whyJoinSection: {
    padding: '4rem 1rem',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '2.5rem',
    color: '#1a1a2e',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem 1.5rem',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardEmoji: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1a1a2e',
  },
  cardDescription: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#555555',
    margin: 0,
  },
  bottomCta: {
    textAlign: 'center',
    padding: '4rem 1rem',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    color: '#ffffff',
  },
  bottomCtaHeading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#ffffff',
  },
  bottomCtaText: {
    fontSize: '1.05rem',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem auto',
  },
};

export default LandingPage;