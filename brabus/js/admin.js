console.log("admin.js chargé");

function apiAdminUrl(fichier) {
    return "../../api/" + fichier;
}

async function getJson(url, options = {}) {
    const reponse = await fetch(url, options);
    const texte = await reponse.text();

    try {
        return JSON.parse(texte);
    } catch (erreur) {
        console.error("Réponse non JSON depuis", url, texte);
        return {
            success: false,
            message: "Erreur PHP ou réponse non JSON. Regarde la console."
        };
    }
}

async function verifierAdmin() {
    const resultat = await getJson(apiAdminUrl("verifier_admin.php"));

    if (!resultat.success) {
        alert("Accès refusé : vous devez être administrateur.");
        window.location.href = "../index.html";
    }
}

verifierAdmin();

/* DASHBOARD */
async function chargerStatsDashboard() {
    const statVehicules = document.querySelector("#statVehicules");
    const statAvis = document.querySelector("#statAvis");
    const statMessages = document.querySelector("#statMessages");
    const statBoutiques = document.querySelector("#statBoutiques");

    if (statVehicules) {
        const r = await getJson(apiAdminUrl("get_vehicules.php"));
        if (r.success) statVehicules.textContent = r.vehicules.length;
    }

    if (statAvis) {
        const r = await getJson(apiAdminUrl("get_avis.php"));
        if (r.success) statAvis.textContent = r.avis.length;
    }

    if (statMessages) {
        const r = await getJson(apiAdminUrl("get_messages.php"));
        if (r.success) statMessages.textContent = r.messages.length;
    }

    if (statBoutiques) {
        const r = await getJson(apiAdminUrl("get_boutiques.php"));
        if (r.success) statBoutiques.textContent = r.boutiques.length;
    }
}

/* VEHICULES */
let vehiculesAdmin = [];

async function chargerVehiculesAdmin() {
    const zone = document.querySelector("#listeVehiculesAdmin");
    if (!zone) return;

    zone.innerHTML = "<p>Chargement...</p>";

    const resultat = await getJson(apiAdminUrl("get_vehicules.php"));

    if (!resultat.success) {
        zone.innerHTML = `<p class="admin-error">${resultat.message}</p>`;
        return;
    }

    vehiculesAdmin = resultat.vehicules;
    afficherVehiculesAdmin(vehiculesAdmin);
}

function afficherVehiculesAdmin(liste) {
    const zone = document.querySelector("#listeVehiculesAdmin");
    if (!zone) return;

    zone.innerHTML = "";

    if (liste.length === 0) {
        zone.innerHTML = "<p>Aucun véhicule trouvé.</p>";
        return;
    }

    liste.forEach(v => {
        const card = document.createElement("article");
        card.className = "admin-vehicle-card";

        card.innerHTML = `
            ${v.image ? `<img src="../${v.image}" alt="${v.modele || "Véhicule"}">` : ""}
            <div class="admin-vehicle-content">
                <h2>${v.marque || ""} ${v.modele || ""}</h2>
                <p>${v.type || ""}</p>
                <p>${v.description || ""}</p>
                <p>${v.puissance || ""} ${v.vitesseMax ? "- " + v.vitesseMax : ""}</p>
                <p><strong>Prix :</strong> ${v.prix || ""} €</p>
                <div class="admin-card-buttons">
                    <button onclick="supprimerVehicule(${v.id_vehicule})">Supprimer</button>
                    <a href="modifier-vehicule.html?id=${v.id_vehicule}">Modifier</a>
                </div>
            </div>
        `;

        zone.appendChild(card);
    });
}

async function supprimerVehicule(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule ?")) return;

    const formData = new FormData();
    formData.append("id_vehicule", id);

    const resultat = await getJson(apiAdminUrl("supprimer_vehicule.php"), {
        method: "POST",
        body: formData
    });

    alert(resultat.message);
    if (resultat.success) chargerVehiculesAdmin();
}

const recherche = document.querySelector("#rechercheVehicule");
if (recherche) {
    recherche.addEventListener("input", () => {
        const texte = recherche.value.toLowerCase();
        const resultat = vehiculesAdmin.filter(v => JSON.stringify(v).toLowerCase().includes(texte));
        afficherVehiculesAdmin(resultat);
    });
}

const formAjout = document.querySelector("#formAjoutVehicule");
if (formAjout) {
    formAjout.addEventListener("submit", async (e) => {
        e.preventDefault();

        const resultat = await getJson(apiAdminUrl("ajouter_vehicule.php"), {
            method: "POST",
            body: new FormData(formAjout)
        });

        alert(resultat.message);
        if (resultat.success) window.location.href = "vehicules.html";
    });
}

/* MODIFIER VEHICULE */
async function chargerVehiculeAModifier() {
    const form = document.querySelector("#formModifierVehicule");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    console.log("id URL =", id);

    if (!id) {
        alert("ID véhicule manquant dans l'URL.");
        return;
    }

    const resultat = await getJson(apiAdminUrl("get_vehicules.php"));
    console.log("vehicules reçus =", resultat);

    if (!resultat.success) {
        alert(resultat.message);
        return;
    }

    const v = resultat.vehicules.find(item => String(item.id_vehicule) === String(id));

    if (!v) {
        alert("Véhicule introuvable dans la BDD.");
        return;
    }

    const champs = ["id_vehicule", "marque", "modele", "image", "type", "moteur", "puissance", "couple", "transmission", "acceleration", "vitesseMax", "prix", "description"];

    champs.forEach(champ => {
        const input = document.querySelector("#" + champ);
        if (input && v[champ] !== undefined) {
            input.value = v[champ];
        }
    });
}

const formModifier = document.querySelector("#formModifierVehicule");
console.log("formModifier =", formModifier);

if (formModifier) {
    formModifier.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("clic modifier détecté");

        const formData = new FormData(formModifier);

        console.log("id envoyé :", formData.get("id_vehicule"));
        console.log("description envoyée :", formData.get("description"));

        const resultat = await getJson(apiAdminUrl("modifier_vehicule.php"), {
            method: "POST",
            body: formData
        });

        console.log("réponse PHP :", resultat);
        alert(resultat.message);

        if (resultat.success) {
            window.location.href = "vehicules.html";
        }
    });
}

/* AVIS */
async function chargerAvisAdmin() {
    const zone = document.querySelector("#listeAvisAdmin");
    if (!zone) return;

    const resultat = await getJson(apiAdminUrl("get_avis.php"));

    if (!resultat.success) {
        zone.innerHTML = `<p class="admin-error">${resultat.message}</p>`;
        return;
    }

    zone.innerHTML = "";

    if (resultat.avis.length === 0) {
        zone.innerHTML = "<p>Aucun avis.</p>";
        return;
    }

    resultat.avis.forEach(a => {
        const card = document.createElement("article");
        card.className = "admin-list-card";

        card.innerHTML = `
            <h2>${a.prenom || ""} ${a.nom || ""}</h2>
            <p><strong>Véhicule :</strong> ${a.modele || ""}</p>
            <p><strong>Note :</strong> ${a.note || ""}/5</p>
            <p>${a.commentaire || ""}</p>
            <p><strong>Date :</strong> ${a.date_avis || ""}</p>
            <button onclick="supprimerAvis(${a.id_avis})">Supprimer</button>
        `;

        zone.appendChild(card);
    });
}

async function supprimerAvis(id) {
    if (!confirm("Supprimer cet avis ?")) return;

    const formData = new FormData();
    formData.append("id_avis", id);

    const resultat = await getJson(apiAdminUrl("supprimer_avis.php"), {
        method: "POST",
        body: formData
    });

    alert(resultat.message);

    if (resultat.success) chargerAvisAdmin();
}

/* MESSAGES */
async function chargerMessagesAdmin() {
    const zone = document.querySelector("#listeMessagesAdmin");
    if (!zone) return;

    const resultat = await getJson(apiAdminUrl("get_messages.php"));

    if (!resultat.success) {
        zone.innerHTML = `<p class="admin-error">${resultat.message}</p>`;
        return;
    }

    zone.innerHTML = "";

    if (resultat.messages.length === 0) {
        zone.innerHTML = "<p>Aucun message.</p>";
        return;
    }

    resultat.messages.forEach(m => {
        const card = document.createElement("article");
        card.className = "admin-list-card";

        card.innerHTML = `
            <h2>${m.sujet || "Message"}</h2>
            <p><strong>De :</strong> ${m.prenom || ""} ${m.nom || ""}</p>
            <p><strong>Email :</strong> ${m.email || ""}</p>
            <p><strong>Téléphone :</strong> ${m.telephone || ""}</p>
            <p>${m.message || ""}</p>
            <p><strong>Date :</strong> ${m.date_envoi || ""}</p>
        `;

        zone.appendChild(card);
    });
}

/* BOUTIQUES */
let boutiquesAdmin = [];

async function chargerBoutiquesAdmin() {
    const zone = document.querySelector("#listeBoutiquesAdmin");
    if (!zone) return;

    const resultat = await getJson(apiAdminUrl("get_boutiques.php"));

    if (!resultat.success) {
        zone.innerHTML = `<p class="admin-error">${resultat.message}</p>`;
        return;
    }

    boutiquesAdmin = resultat.boutiques;
    zone.innerHTML = "";

    if (boutiquesAdmin.length === 0) {
        zone.innerHTML = "<p>Aucune boutique.</p>";
        return;
    }

    boutiquesAdmin.forEach(b => {
        const card = document.createElement("article");
        card.className = "admin-list-card";

        card.innerHTML = `
            <h2>${b.nom || "Boutique"}</h2>
            <p><strong>Adresse :</strong> ${b.adresse || ""}</p>
            <p><strong>Ville :</strong> ${b.ville || ""}</p>
            <p><strong>Code postal :</strong> ${b.code_postal || ""}</p>
            <p><strong>Horaires :</strong> ${b.horaires || ""}</p>
            <div class="admin-list-actions">
                <button onclick="remplirBoutique(${b.id_boutique})">Modifier</button>
                <button onclick="supprimerBoutique(${b.id_boutique})">Supprimer</button>
            </div>
        `;

        zone.appendChild(card);
    });
}

function remplirBoutique(id) {
    const b = boutiquesAdmin.find(item => String(item.id_boutique) === String(id));
    if (!b) return;

    document.querySelector("#id_boutique").value = b.id_boutique;
    document.querySelector("#nom").value = b.nom || "";
    document.querySelector("#adresse").value = b.adresse || "";
    document.querySelector("#ville").value = b.ville || "";
    document.querySelector("#code_postal").value = b.code_postal || "";
    document.querySelector("#horaires").value = b.horaires || "";

    document.querySelector("#btnBoutique").textContent = "Modifier la boutique";
    document.querySelector("#btnAnnulerBoutique").style.display = "inline-block";
}

const btnAnnulerBoutique = document.querySelector("#btnAnnulerBoutique");
if (btnAnnulerBoutique) {
    btnAnnulerBoutique.addEventListener("click", () => {
        document.querySelector("#formBoutique").reset();
        document.querySelector("#id_boutique").value = "";
        document.querySelector("#btnBoutique").textContent = "Ajouter la boutique";
        btnAnnulerBoutique.style.display = "none";
    });
}

const formBoutique = document.querySelector("#formBoutique");
if (formBoutique) {
    formBoutique.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(formBoutique);
        const id = formData.get("id_boutique");
        const api = id ? "modifier_boutique.php" : "ajouter_boutique.php";

        const resultat = await getJson(apiAdminUrl(api), {
            method: "POST",
            body: formData
        });

        alert(resultat.message);

        if (resultat.success) {
            formBoutique.reset();
            document.querySelector("#id_boutique").value = "";
            document.querySelector("#btnBoutique").textContent = "Ajouter la boutique";
            document.querySelector("#btnAnnulerBoutique").style.display = "none";
            chargerBoutiquesAdmin();
        }
    });
}

async function supprimerBoutique(id) {
    if (!confirm("Supprimer cette boutique ?")) return;

    const formData = new FormData();
    formData.append("id_boutique", id);

    const resultat = await getJson(apiAdminUrl("supprimer_boutique.php"), {
        method: "POST",
        body: formData
    });

    alert(resultat.message);
    if (resultat.success) chargerBoutiquesAdmin();
}

/* Lancements automatiques selon la page */
chargerStatsDashboard();
chargerVehiculesAdmin();
chargerVehiculeAModifier();
chargerAvisAdmin();
chargerMessagesAdmin();
chargerBoutiquesAdmin();
