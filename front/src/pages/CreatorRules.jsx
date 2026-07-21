export default function CreatorRules() {

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Règles de publication</h1>

            <p className="mb-4 text-gray-700">
                Avant de publier du contenu sur la plateforme, merci de prendre connaissance des règles suivantes.
                Elles permettent de garantir un environnement sain, légal et respectueux pour tous les utilisateurs.
            </p>

            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Pas de contenu illégal (violence extrême, contenu interdit, etc.)</li>
                <li>Pas de plagiat : vous devez posséder les droits sur vos créations</li>
                <li>Respect des autres créateurs et des lecteurs</li>
                <li>Pas de spam ou de contenu trompeur</li>
                <li>Respect des guidelines de la plateforme</li>
            </ul>

            <p className="mb-6 text-sm text-gray-500">
                En cliquant sur "J'accepte", vous confirmez avoir lu et accepté ces règles.
                Tout contenu ne respectant pas ces conditions pourra être supprimé sans préavis.
            </p>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                    window.location.href = "/creator/dashboard";
                }}
            >
                J'accepte
            </button>
        </div>
    );
}
