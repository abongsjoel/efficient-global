import Header from "../components/molecules/Header";
import Footer from "../components/organisms/Footer";
import ContactSection from "../components/organisms/Contact";

const Contact = () => {
  return (
    <section className="min-h-screen">
      <Header />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </section>
  );
};

export default Contact;
