export default function Contact() {
  const defaults = {
    email: "hello@chefsite.example",
    phone: "+1 (555) 123-4567",
    address: "123 Flavor St, Food City",
  };
  let saved = {};
  try {
    const raw = localStorage.getItem("chefsite_contact_v1");
    if (raw) saved = JSON.parse(raw);
  } catch {}
  const email = saved.email || defaults.email;
  const phone = saved.phone || defaults.phone;
  const address = saved.address || defaults.address;

  return (
    <section>
      <h2>Contact Us</h2>
      <div className="contact">
        <div>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Address: {address}</p>
        </div>
        <form name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="4" required />
          </label>
          <button className="btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
