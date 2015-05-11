var EntityMap = (function() {

    var map = {};

    /**
     * Find an entity by ID
     *
     * @param  Integer id The unique ID for an entity
     * @return Object/Bool The entity associated to that ID or false
     */
    function find(id) {
        var e = map[id];

        if(e != undefined) {
            return e;
        }

        return false;
    }

    /**
     * Add a new entity to the map
     *
     * @param Object entity
     * @return String the UID for this entity
     */
    function add(UID, entity) {
        map[UID] = entity;
        return UID;
    }

    /**
     * Remove entity from map
     *
     * @param  Integer UID
     */
    function remove(UID) {
        var index = map.indexOf(UID);

        console.log(index + " : : " + UID);

        if(index != -1) {
            map = map.splice(index, 1);
        }
    }

    /**
     * Get for the map field
     *
     * @return Array the entity map
     */
    function getMap() {
        return map;
    }

    // Give access to 'public' stuff
    return {
        find: find,
        add: add,
        getMap: getMap
    };
});
