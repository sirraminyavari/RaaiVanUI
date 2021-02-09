window.loadKnowledge = () => {
    GlobalUtilities.load_files(["KnowledgeTypes/KnowledgeTypesManager.js"], {
        OnLoad: function () { new KnowledgeTypesManager("knowledgeArea"); }
    });
};