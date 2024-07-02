document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire

        const formData = new FormData(this);
        const formDataJson = {};

        formData.forEach((value, key) => {
            formDataJson[key] = value;
        });

        // Envoi des données au serveur Node.js pour l'envoi d'email et la sauvegarde dans un fichier
        fetch('/send-email-and-save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJson),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Affiche le message de réussite ou d'erreur
            // Réinitialise le formulaire après soumission réussie
            contactForm.reset();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'envoi du formulaire.');
        });
    });
});
