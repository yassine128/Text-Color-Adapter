/*
    The code works but for some reason when I train it with tensorflow.js it doesnt work... Works with python.

    Will have to write a json file where all the data will be saved and then use a python script to make it work. 
*/


var model = await tf.loadLayersModel('saved_model/modeljs/model.json'); // Load the js model

/**
 * Main function of the website
 */
function main(){
    const finishedTrain = false;
    const listOfDefaultColors = [[0, 0, 0], [255, 255, 255], [88, 215, 20], 
                                [53, 115, 12], [177, 221, 110], [73, 92, 167],
                                [76, 200, 169], [32, 147, 16], [156, 34, 180], 
                                [213, 146, 227], [215, 234, 174], [223, 88, 187], 
                                [123, 34, 170], [81, 195, 210], [4, 154, 124], 
                                [206, 201, 28], [149, 147, 86], [255, 0, 0]];
    var newData = new Map(); 

    document.getElementById('colorPicked').style.display = 'none';
    document.getElementById('display').style.display = 'none';

    const B1 = document.getElementById('B1');
    const B2 = document.getElementById('B2');

    let i = -1;

    B1.onclick = () => {
        i++;
        btnClick('B1', i, listOfDefaultColors, newData);
    }

    B2.onclick = () => {
        i++; 
        btnClick('B2', i, listOfDefaultColors, newData);
    } 
}

function onBatchEnd(batch, logs) {
    console.log('Accuracy', logs.acc);
}  

function trainNewData(newData) {
    let data = [];
    let labels = []; 

    for (var [key, value] of newData.entries()) {
        data.push(key);
        labels.push(value);
    }

    data = tf.tensor2d(data);
    labels = tf.tensor1d(labels);
    
    
    const learningRate = 0.01;
    const optimizer = tf.train.adagrad(learningRate);
    
    

    model.compile({
        optimizer: optimizer,
        loss: 'meanSquaredError',
        metrics: ['accuracy']
    });


    model.fit(data, labels, {
        epochs: 305,
        batchSize: 32,
        callbacks: {onBatchEnd}
    }).then(info => {
        console.log('Final accuracy', info.history.acc);
    });
}

/**
 * Function that will save the data picked when the user click on a button
 * @param {*} Btn Button clicked
 * @param {*} i variable to keep track of where we are in the array
 * @param {*} listOfDefaultColors list of default colors to train on 
 * @param {*} newData Hashmap of data picked from the user
 */
function btnClick(Btn, i, listOfDefaultColors, newData){
    if (i < listOfDefaultColors.length) {
        document.getElementById('B1').style.backgroundColor = 'rgb(' + listOfDefaultColors[i][0] + ',' + listOfDefaultColors[i][1] + ',' + listOfDefaultColors[i][2] + ')';
        document.getElementById('B2').style.backgroundColor = 'rgb(' + listOfDefaultColors[i][0] + ',' + listOfDefaultColors[i][1] + ',' + listOfDefaultColors[i][2] + ')';

        var dataTensor = [(listOfDefaultColors[i][0])/255, (listOfDefaultColors[i][1])/255, (listOfDefaultColors[i][2])/255]

        if (Btn == 'B1') {
            newData.set(dataTensor, 1);
        }
        else {
            newData.set(dataTensor, 0);
        }
    }

    else if (i = 17) {
        document.getElementById('colorPicked').style.display = 'block';
        document.getElementById('display').style.display = 'block';
        document.getElementById('B1').style.display = 'none';
        document.getElementById('B2').style.display = 'none';

        console.log(newData)
        trainNewData(newData);
    }
}


/**
 * This function will transform the float guessed by the model into an integer.
 * @param {*} value value guesse by the model
 * @returns integer 1 or 0
 */
function guess(value) {
    if (value < 0.5) {
        return 0
    } 
    else{
        return 1
    }
}

/**
 * function that gives the rgb value of the HEX color
 * @param {*} hex Hex code of the color
 * @returns the rgb value
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

/**
 * Function that will predict the value of the text
 */
function modelPredict(r, g, b) {
    var input = tf.tensor2d([[r/255, g/255, b/255]]); 

    let results = model.predict(input); // Prediciton of the model
    var value = guess(results.dataSync()[0])

    return value;
}


main()

document.getElementById('colorPicked').addEventListener('input', function() {
    var rgbVal = hexToRgb(this.value);
    var valueText = modelPredict(rgbVal.r, rgbVal.g, rgbVal.b);

    document.getElementById('display').style.backgroundColor = this.value; // Changes the color of the background
    document.getElementById('textCol').style.color = 'rgb(' + valueText*255 + ',' + valueText*255 + ',' + valueText*255 + ')';
})