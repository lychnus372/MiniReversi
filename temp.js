
const model = tf.sequential();
model.add(tf.layers.conv2d({
    inputShape: [4, 4, 2],
    kernelSize: 3,
    filters: 8,
    strides: 1,
    padding: 'same',
    activation: 'relu',
    kernelInitializer: 'VarianceScaling',
}));
model.add(tf.layers.conv2d({
    kernelSize: 3,
    filters: 8,
    strides: 1,
    padding: 'same',
    activation: 'relu',
    kernelInitializer: 'VarianceScaling',
}));
model.add(tf.layers.flatten({}));
model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
}));
model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
}));
model.add(tf.layers.dense({
    units: 1,
    activation: 'relu',
}));


const loss = (batch, label)=>{
    return tf.tidy(()=>{
        const pred = model.predict(batch);
        const mean = pred.sub(label).square().mean();
        return mean;
    });
};

const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE);
model.compile({
    optimizer,
    loss: 'meanSquaredError',
    metrics: ['accuracy'],
});



const generateData = ()=>{
    const batch_arr = new Array(32);
    const label_arr = new Array(1);
    const node = master.generateNode(10);

    batch_arr.fill(0);
    label_arr.fill(0);

    for(let i=0;i<16;i++){
        if(node.black&(1<<(15-i))){
            batch_arr[i] = 1;
        }
        if(node.white&(1<<(15-i))){
            batch_arr[i+16] = 1;
        }
    }

    label_arr[0] = ai.negaScout(node, -16, 16, -1)/32+0.5;

    return {batch_arr, label_arr};
};

const generateTrainingData = (BATCH_SIZE=1)=>{
    const batch_arr = new Float32Array(BATCH_SIZE*32);
    const label_arr = new Float32Array(BATCH_SIZE*1);

    for(let i=0;i<BATCH_SIZE;i++){
        const data = generateData();
        batch_arr.set(data.batch_arr, i*32);
        label_arr.set(data.label_arr, i*1);
    }

    const batch = tf.tensor4d(batch_arr, [BATCH_SIZE, 4, 4, 2]);
    const label = tf.tensor2d(label_arr, [BATCH_SIZE, 1]);

    return {batch, label};
};

const trainModel = async (iter=100)=>{
    for(let i=0;i<iter;i++){
        const data = generateTrainingData(Math.random()<0.5?8:12);
        const batch = data.batch;
        const label = data.label;
        await model.fit(batch, label);
    }
    console.log('fin');

    /*for(let i=0;i<iter;i++){
        const data = generateTrainingData(10);
        const batch = data.batch;
        const label = data.label;
        optimizer.minimize(()=>{
            return loss(batch, label);
        });
    }*/
};

const tamesu = ()=>{
    const batch_arr = new Array(32);
    const label_arr = new Array(1);
    const node = master.generateNode();

    batch_arr.fill(0);
    label_arr.fill(0);console.log(node);

    for(let i=0;i<16;i++){
        if(node.black&(1<<(15-i))){
            batch_arr[i] = 1;
        }
        if(node.white&(1<<(15-i))){
            batch_arr[i+16] = 1;
        }
    }

    const batch = tf.tensor4d(batch_arr, [1, 4, 4, 2]);
    const pred = model.predict(batch);
    const pred_arr = pred.dataSync();
    const true_value = ai.negaScout(node, -16, 16, -1);

    master.render(node);

    console.log(true_value, (pred_arr[0]-0.5)*32);
};