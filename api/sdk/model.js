const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    x1 = (data[0] - 42.31879699) / 10.48653863
    x2 = (data[1] - 88.8075188) / 19.29328815
    x3 = (data[2] - 142.718797) / 23.03331842
    return [x1, x2, x3]
}

function denormalized(data){
    nx1 = (data[0] * 9.12330183) + 50.89473684
    nx2 = (data[1] * 14.55269981) + 10620.5615
    nx2 = (data[1] * 24.38662034) + 159.081203
    return [nx1, nx2, nx3]
}


async function predict(data){
    let in_dim = 3;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/ZeonAyase/LuthfiGunturBot/main/public/ex_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
  
