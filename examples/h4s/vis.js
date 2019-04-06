function Elastic(v) {
    this.target = v;
    this.current = v;
    this.delta = 0;

    this.update = function() {
        this.delta *= 0.8;
        this.delta += 0.05 * (this.target - this.current);
        this.current += 0.9 * this.delta;
    }

    return this;
}

function visualisation() {

    var volume;
    var volume2;
    var volume3;
    var volume4;
    var grid;
    var root;
    var root;
    var scene;

    var billboard1, billboard2, billboard3, billboard4, targetbillboard;

    // International flights
    // Domestic flights
    // Public transport
    // Private transport

    var e_volume = new Elastic(0.1);
    var e_split1 = new Elastic(0.40);
    var e_split2 = new Elastic(0.25);
    var e_split3 = new Elastic(0.10);
    var e_split4 = new Elastic(0.15);
    var e_target = new Elastic(0.5);

    function init(_scene) {
        scene = _scene;

        reticleParent = new THREE.Object3D();
        floorPosition = new THREE.Object3D();
        root = new THREE.Object3D();

        grid = new THREE.Mesh(
            new THREE.BoxGeometry(1.1, 1.01, 1.1, 10, 1, 10),
            new THREE.MeshBasicMaterial({ color: '#00ff00', wireframe: true })
        );

        volume = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 1.0, 10, 10, 10),
            new THREE.MeshPhongMaterial({ color: '#403040' })
        );

        volume2 = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 1.0, 3, 3, 3),
            new THREE.MeshPhongMaterial({ color: '#504050' })
        );

        volume3 = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 1.0, 3, 3, 3),
            new THREE.MeshPhongMaterial({ color: '#605060' })
        );

        volume4 = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 1.0, 3, 3, 3),
            new THREE.MeshPhongMaterial({ color: '#907080' })
        );

        volume.castShadow = true;
        volume2.castShadow = true;
        volume3.castShadow = true;
        volume4.castShadow = true;

        volume.receiveShadow = true;
        volume2.receiveShadow = true;
        volume3.receiveShadow = true;
        volume4.receiveShadow = true;

        if (!volume.matrix) {
            return;
        }

        var spritetexture = new THREE.TextureLoader().load( 'target.png' );
        var spritematerial = new THREE.SpriteMaterial({
            map: spritetexture,
            useScreenCoordinates: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
        } );
        targetbillboard = new THREE.Sprite( spritematerial );
        targetbillboard.scale.set(2, 2, 2);
        root.add(targetbillboard);

        var spritetexture = new THREE.TextureLoader().load( 'billboard1.png' );
        var spritematerial = new THREE.SpriteMaterial({
            map: spritetexture,
            useScreenCoordinates: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
        } );
        billboard1 = new THREE.Sprite( spritematerial );
        billboard1.scale.set(2, 2, 2);
        root.add(billboard1);

        var spritetexture = new THREE.TextureLoader().load( 'billboard2.png' );
        var spritematerial = new THREE.SpriteMaterial({
            map: spritetexture,
            useScreenCoordinates: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
        } );
        billboard2 = new THREE.Sprite( spritematerial );
        billboard2.scale.set(2, 2, 2);
        root.add(billboard2);

        var spritetexture = new THREE.TextureLoader().load( 'billboard3.png' );
        var spritematerial = new THREE.SpriteMaterial({
            map: spritetexture,
            useScreenCoordinates: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
        } );
        billboard3 = new THREE.Sprite( spritematerial );
        billboard3.scale.set(2, 2, 2);
        root.add(billboard3);

        var spritetexture = new THREE.TextureLoader().load( 'billboard4.png' );
        var spritematerial = new THREE.SpriteMaterial({
            map: spritetexture,
            useScreenCoordinates: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            alphaTest: 0.1,
        } );
        billboard4 = new THREE.Sprite( spritematerial );
        billboard4.scale.set(2, 2, 2);
        root.add(billboard4);

        var geometry = new THREE.BoxGeometry(10.0, 0.01, 10.0, 3, 3, 3);

        var material = new THREE.ShadowMaterial();
        plane = new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;

        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.6, 0));

        root.add(volume);
        root.add(volume2);
        root.add(volume3);
        root.add(volume4);
        root.add(grid);
        root.add(plane);

        volume.position.set(0, -0.5, 0);
        volume2.position.set(0, -0.25, 0);
        volume3.position.set(0, 0.25, 0);
        volume4.position.set(0, 0.5, 0);

        return root;
    }

    function setVolume(kgco2) {
        e_volume.target = kgco2;
    }

    function setSplit(a,b,c,d) {
        e_split1.target = a;
        e_split2.target = b;
        e_split3.target = c;
        e_split4.target = d;
    }

    function setTarget(kgco2) {
        e_target.target = kgco2;
    }

    function start() {
        scanFloor();
    }

    function update() {
        e_volume.update();
        e_split1.update();
        e_split2.update();
        e_split3.update();
        e_split4.update();
        e_target.update();

        // convert from kg co2 to mass using normal temperatur density, then square root it to get side length
        // 1 tonne = 1000 kg = 556 liters = 556 m3 = ~ 8x8x8m

        var v = e_volume.current * 0.556;
        var d = (Math.cbrt(v) / 2.0) / 10.0;

        var m1 = new THREE.Matrix4();
        m1.makeTranslation(0, d/2, d/2);

        var m2 = new THREE.Matrix4();
        m2.makeScale(d, d, d);
        m1.multiply(m2);

        root.matrix.copy(m1);
        root.matrixAutoUpdate = false;
        root.updateMatrixWorld(true)

        var SEPARATION = 0.01;
        var EPSILON = 0.01;

        var o = -0.5;
        var h = e_split1.current;

        if (h > EPSILON) {
            m1 = new THREE.Matrix4();
            m1.makeTranslation(0, o + h/2, 0);
            m2 = new THREE.Matrix4();
            m2.makeScale(1, h, 1);
            m1.multiply(m2);

            volume.matrix.copy(m1);
            volume.matrixAutoUpdate = false;
            volume.updateMatrixWorld(true)
            volume.visible = true;

            billboard1.position.set(-0.5, o + h/2,-0.5);
            billboard1.visible = true;

            o += SEPARATION;
            o += h;
        } else {
            volume.visible = false;
            billboard1.visible = false;
        }

        h = e_split2.current;
        if (h > EPSILON) {

            m1 = new THREE.Matrix4();
            m1.makeTranslation(0, o + h/2, 0);
            m2 = new THREE.Matrix4();
            m2.makeScale(1, h, 1);
            m1.multiply(m2);

            volume2.matrix.copy(m1);
            volume2.matrixAutoUpdate = false;
            volume2.updateMatrixWorld(true)
            volume2.visible = true;
            billboard2.position.set(-0.5,o + h/2,-0.5);
            billboard2.visible = true;

            o += SEPARATION;
            o += h;
        } else {
            volume2.visible = false;
            billboard2.visible = false;
        }

        h = e_split3.current;
        if (h > EPSILON) {

            m1 = new THREE.Matrix4();
            m1.makeTranslation(0, o + h/2, 0);
            m2 = new THREE.Matrix4();
            m2.makeScale(1, h, 1);
            m1.multiply(m2);

            volume3.matrix.copy(m1);
            volume3.matrixAutoUpdate = false;
            volume3.updateMatrixWorld(true)
            volume3.visible = true;
            billboard3.position.set(-0.5,o + h/2,-0.5);
            billboard3.visible = true;

            o += SEPARATION;
            o += h;
        } else {
            volume3.visible = false;
            billboard3.visible = false;
        }

        h = e_split4.current;
        if (h > EPSILON) {

            m1 = new THREE.Matrix4();
            m1.makeTranslation(0, o + h/2, 0);
            m2 = new THREE.Matrix4();
            m2.makeScale(1, h, 1);
            m1.multiply(m2);

            volume4.matrix.copy(m1);
            volume4.matrixAutoUpdate = false;
            volume4.updateMatrixWorld(true)
            volume4.visible = true;

            billboard4.position.set(-0.5,o + h/2,-0.5);
            billboard4.visible = true;
        } else {
            volume4.visible = false;
            billboard4.visible = false;
        }

        if (e_volume.current >= e_target.current && e_volume.current > EPSILON) {
            h = e_target.current / e_volume.current;
            if (h > EPSILON) {
                m1 = new THREE.Matrix4();
                m1.makeTranslation(0, h - 0.5, 0);
                m2 = new THREE.Matrix4();
                m2.makeScale(1, 0.01, 1);
                m1.multiply(m2);

                grid.matrix.copy(m1);
                grid.matrixAutoUpdate = false;
                grid.updateMatrixWorld(true)
                grid.visible = true;

                targetbillboard.position.set(-0.55, h - 0.5, -0.55);
                targetbillboard.visible = true;
            } else {
                grid.visible = false;
                targetbillboard.visible = false;
            }
        } else {
            grid.visible = false;
            targetbillboard.visible = false;
        }
    }

    return {
        init,
        start,
        update,
        setVolume,
        setSplit,
        setTarget,
    }
}

