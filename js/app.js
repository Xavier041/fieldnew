document.addEventListener("DOMContentLoaded", function () {
    const info = document.getElementById('info')
    const infoContent = document.getElementById('infoContent')
    let organizationId1;
    let organizationName;
    let organizationId;
    const NameAndId = []
    async function getName() {
        const resp1 = await fetch('js/organizations.json');
        const data1 = await resp1.json();
        const organizations = data1.Organizations;

        for (let i = 0; i < organizations.length; i++) {
            const id = organizations[i].Id;
            const name = organizations[i].Name;
            NameAndId.push({
                id: id,
                name: name
            });

        }
    }

    getName();

    async function fieldRendering() {
        const response = await fetch(' http://agro.energomera.ru:3060/api/field?lastChangeDate=2010-08-03T16:47:01.307&skip=90&take=1');
        const data = await response.json();
        const coordinates = JSON.parse(data[0].Location);
        const latitude = coordinates.Center[0];
        const longitude = coordinates.Center[1];
        organizationId = data[0].OrganizationId;
        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap',
            maxZoom: 18,
        }).addTo(map);
        const polygon = L.polygon(coordinates.Polygon).addTo(map);
        const marker = L.marker([latitude, longitude], {
            icon: markIco
        }).addTo(map);
        let b = NameAndId.find(item => {
            if (item.id === organizationId) {
                return true
            }
        })
        marker.on('click', function () {

            info.style.display = "flex";

            infoContent.innerHTML = b.name;
        })
        const closeButton = document.querySelector('.btn-close');

        closeButton.addEventListener('click', function () {
            info.style.display = "none";
        });
    }

    fieldRendering();
    const markIco = L.divIcon({
        html: '92',
        className: 'marker',
        iconSize: [21, 24]

    });
});
