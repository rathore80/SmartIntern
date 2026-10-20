
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <main className="home-page">

            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-content">
                    <span className="home-eyebrow">
                        YOUR CAREER STARTS HERE
                    </span>

                    <h1>
                        Your next opportunity.
                        <span> Your future.</span>
                    </h1>

                    <p>
                        Discover internships and jobs that match your
                        skills, showcase your potential, and take the
                        next step in your career with SmartIntern.
                    </p>

                    <div className="home-hero-actions">
                        <Link
                            to="/student/jobs"
                            className="home-btn home-btn-primary"
                        >
                            Explore Opportunities <span>→</span>
                        </Link>

                        <Link
                            to="/register"
                            className="home-btn home-btn-secondary"
                        >
                            Get Started
                        </Link>
                    </div>

                    <div className="home-trust-note">
                        <span className="home-status-dot"></span>
                        <span>Discover opportunities. Build your future.</span>
                    </div>
                </div>

                <div className="home-hero-visual">
                    <div className="home-visual-glow"></div>

                    <div className="home-visual-card">
                        <div className="home-visual-top">
                            <div>
                                <span className="home-visual-label">
                                    CAREER DASHBOARD
                                </span>
                                <h3>Your next chapter</h3>
                            </div>
                            <span className="home-visual-icon">✦</span>
                        </div>

                        <div className="home-profile-preview">
                            <div className="home-avatar">S</div>
                            <div>
                                <strong>Student Profile</strong>
                                <p>Skills · Projects · Experience</p>
                            </div>
                        </div>

                        <div className="home-preview-divider"></div>

                        <div className="home-opportunity-preview">
                            <div className="home-opportunity-icon">⌘</div>
                            <div>
                                <strong>Find your opportunity</strong>
                                <p>Explore jobs that fit your goals</p>
                            </div>
                            <span className="home-preview-arrow">↗</span>
                        </div>

                        <div className="home-opportunity-preview">
                            <div className="home-opportunity-icon home-icon-purple">
                                ↗
                            </div>
                            <div>
                                <strong>Track your progress</strong>
                                <p>Keep your applications organized</p>
                            </div>
                            <span className="home-preview-arrow">↗</span>
                        </div>

                        <div className="home-visual-footer">
                            <span>Small steps.</span>
                            <strong>Big possibilities.</strong>
                        </div>
                    </div>

                    <div className="home-floating-tag home-floating-top">
                        <span>✦</span> Find your fit
                    </div>

                    <div className="home-floating-tag home-floating-bottom">
                        <span>✓</span> Your journey, organized
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="home-intro">
                <span className="home-section-label">BUILT FOR YOUR NEXT STEP</span>
                <h2>
                    More than a job search.
                    <br />
                    <span>A smarter way to get started.</span>
                </h2>
                <p>
                    From building your profile to tracking applications,
                    SmartIntern brings your career journey into one place.
                </p>
            </section>

            {/* Features */}
            <section className="home-features">
                <article className="home-feature-card">
                    <div className="home-feature-icon home-feature-blue">
                        <span>⌕</span>
                    </div>
                    <span className="home-feature-number">01 / DISCOVER</span>
                    <h3>Find opportunities</h3>
                    <p>
                        Explore jobs and internships that align with your
                        interests, skills, and career goals.
                    </p>
                    <Link to="/student/jobs" className="home-text-link">
                        Explore jobs <span>→</span>
                    </Link>
                </article>

                <article className="home-feature-card">
                    <div className="home-feature-icon home-feature-purple">
                        <span>✳</span>
                    </div>
                    <span className="home-feature-number">02 / MATCH</span>
                    <h3>Discover your fit</h3>
                    <p>
                        Get personalized recommendations based on your
                        profile, experience, and preferences.
                    </p>
                    <Link
                        to="/student/recommendations"
                        className="home-text-link"
                    >
                        View recommendations <span>→</span>
                    </Link>
                </article>

                <article className="home-feature-card">
                    <div className="home-feature-icon home-feature-green">
                        <span>↗</span>
                    </div>
                    <span className="home-feature-number">03 / PROGRESS</span>
                    <h3>Track your journey</h3>
                    <p>
                        Keep track of your applications and follow their
                        progress from one convenient place.
                    </p>
                    <Link
                        to="/student/applications"
                        className="home-text-link"
                    >
                        Track applications <span>→</span>
                    </Link>
                </article>
            </section>

            {/* How It Works */}
            <section className="home-how">
                <div className="home-how-heading">
                    <span className="home-section-label">THREE SIMPLE STEPS</span>
                    <h2>Your journey starts with <span>you.</span></h2>
                    <p>
                        A straightforward path from creating your profile
                        to applying for your next opportunity.
                    </p>
                </div>

                <div className="home-steps">
                    <article className="home-step">
                        <span className="home-step-number">01</span>
                        <div>
                            <h3>Build your profile</h3>
                            <p>
                                Add your education, skills, projects,
                                experience, and resume.
                            </p>
                        </div>
                    </article>

                    <article className="home-step">
                        <span className="home-step-number">02</span>
                        <div>
                            <h3>Explore your options</h3>
                            <p>
                                Browse available positions and discover
                                personalized recommendations.
                            </p>
                        </div>
                    </article>

                    <article className="home-step">
                        <span className="home-step-number">03</span>
                        <div>
                            <h3>Apply and keep moving</h3>
                            <p>
                                Apply for suitable roles and monitor your
                                application status.
                            </p>
                        </div>
                    </article>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="home-cta">
                <div>
                    <span className="home-section-label">
                        YOUR NEXT CHAPTER AWAITS
                    </span>
                    <h2>Ready to make your move?</h2>
                    <p>
                        Create your profile and start exploring
                        opportunities with SmartIntern.
                    </p>
                </div>

                <Link to="/register" className="home-btn home-cta-button">
                    Start Your Journey <span>→</span>
                </Link>
            </section>

        </main>
    );
};

export default Home;
