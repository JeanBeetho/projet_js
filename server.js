const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Middleware pour servir les fichiers statiques depuis le répertoire 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route POST pour enregistrer le commentaire
app.post('/save', (req, res) => {
    const { nom, commentaire } = req.body;

    if (!nom || !commentaire || nom.trim() === '' || commentaire.trim() === '') {
        return res.status(400).send('Nom d\'utilisateur ou commentaire vide');
    }

    // Ajouter le commentaire au fichier texte
    fs.appendFile(path.join(__dirname, 'fichier.txt'), `${nom}: ${commentaire}\n`, err => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier:', err);
            return res.status(500).send('Erreur lors de l\'enregistrement');
        }
        res.send('Commentaire enregistré avec succès');
    });
});

// Route GET pour récupérer les dix derniers commentaires
app.get('/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'fichier.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            return res.status(500).send('Erreur lors de la récupération des commentaires');
        }

        const commentaires = data.trim().split('\n').slice(-10).map(line => {
            const [nom, commentaire] = line.split(': ');
            return { nom, commentaire };
        });

        res.json(commentaires);
    });
});

// Route pour servir la page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/Equipe', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Equipe.html'));
});

app.get('/Offrre', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Nosoffres.html'));
});
// la partie du contact
app.post('/send-email-and-save', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Enregistrer les données dans un fichier (exemple)
    const dataToSave = `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\nMessage: ${message}\n\n`;
    fs.appendFile('form-data.txt', dataToSave, (err) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement des données:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des données.' });
        }
        console.log('Données enregistrées avec succès.');

        // Configurer et envoyer l'email avec nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jeanbeethod@gmail.com',
                pass: 'nwnx sole jdmf pgyw'
            }
        });
        
        const mailOptions = {
            from:email, // Adresse e-mail de l'expéditeur
            to: 'jeanbeethod@gmail.com', // Adresse e-mail du destinataire
            subject: `Nouveau message de ${name}: ${subject}`,
            text: `${message}\n\nEmail de l'expéditeur: ${email}`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
            }
            console.log('Email envoyé:', info.response);
            res.status(200).json({ message: 'Formulaire soumis avec succès.' });
        });
    });
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
