
function visualisation() {

    var reticleParent;
    var floorPosition;
    var volume;
    var grid;
    var root;
    var reticle;
    var reticle2;
    var root;
    var scene;

    var currentVolume = 0;
    var targetVolume = 0.1;
    var deltaVolume = 0;

    function init(_scene) {
        scene = _scene;

        reticleParent = new THREE.Object3D();
        floorPosition = new THREE.Object3D();
        root = new THREE.Object3D();

        grid = new THREE.Mesh(
            new THREE.BoxGeometry(1.005, 1.005, 1.005, 10, 10, 10),
            new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true })
        );

        volume = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 1.0, 10, 10, 10),
            new THREE.MeshPhongMaterial({ color: '#888888' })
        );

        // window.setvolume = this.setVolume.bind(this);
        // window.resetfloor = this.resetFloor.bind(this);

        // reticle.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)))
        // reticle.visible = false;
        // reticle2.visible = false;
        // volume.visible = false;
        // grid.visible = false;
        root.add(volume);
        root.add(grid);
        // scene.add(reticleParent);

        // Add a few lights
        // this.scene.add(new THREE.AmbientLight('#888', 0.2))
        // let directionalLight = new THREE.DirectionalLight('#FFF', 0.6)
        // directionalLight.position.set(3, 10, -7);
        // this.scene.add(directionalLight)

        // this.resetFloor();

        return root;
    }

    function setVolume(v) {
        var d = v * 0.556 / 1;
        var s = 5; // Math.ceil(v / );
        targetVolume = d;
    }

    function start() {
        scanFloor();
    }

    function update() {

        deltaVolume *= 0.8;
        deltaVolume += 0.1 * (targetVolume - currentVolume);
        currentVolume += 0.7 * deltaVolume;


        // // this.volume.geometry = new THREE.BoxGeometry(d, d, d, s, s, s);
        // // this.volume.matrix.setPosition( new THREE.Vector3(0, d/2, d/2) );

        var d = currentVolume;

        var m1 = new THREE.Matrix4();
        m1.makeTranslation(0, d/2, d/2);

        var m2 = new THREE.Matrix4();
        m2.makeScale(d, d, d);
        m1.multiply(m2);

        // this.volumeBase.matrix.setScale(new THREE.Vector3(d, d, d) );
        root.matrix.copy(m1);
        root.matrixAutoUpdate = false;
        root.updateMatrixWorld(true)
    }

    return {
        init,
        start,
        update,
        setVolume,
    }
}

