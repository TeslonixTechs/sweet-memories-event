# Sweet Memories Prestige Event

Static HTML, CSS and JavaScript site. Open `index.html` locally to preview, or deploy the folder to a static web host.

## Before publishing

1. In `script.js`, set `BUSINESS.whatsapp` to the business WhatsApp number in international format using digits only, including the country code. Set `BUSINESS.phone` to the call number.
2. Add only approved services in the Services section of `index.html`.
3. Add real, business-supplied event photographs and project details to the `portfolioProjects` array in `script.js`. Use image paths relative to this folder, such as `images/wedding-ceremony.jpg`. Each project needs a unique `slug`, `type`, `title`, `location`, `description`, `cover`, and `imageAlt`. Optional `year` and `images` fields add a date label and detail-page gallery.
4. Add genuine client testimonials only after the business supplies and approves the exact review text and attribution.

Each project gets a shareable detail URL in the form `?event=your-project-slug`. The gallery filters are generated from the project types; use `Weddings`, `Traditional Ceremonies`, `Birthdays`, `Corporate Events`, or `Social Celebrations` for the supplied filters.

The enquiry form prepares the visitor's details as a WhatsApp message. It does not store or submit personal information to a server.