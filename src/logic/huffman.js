const getCharColor = (char) => {
    const palette = {
        'a': '#FF6B6B', 'b': '#4ECDC4', 'c': '#45B7D1', 'd': '#96CEB4',
        'e': '#FFEAA7', 'f': '#DDA15E', 'g': '#BC6C25', 'h': '#FF9F1C',
        'i': '#2EC4B6', 'j': '#E71D36', 'k': '#FF9F1C', 'l': '#CBF3F0',
        'm': '#FFBF69', 'n': '#FFFFFF', 'o': '#00B4D8', 'p': '#90E0EF',
        'q': '#0077B6', 'r': '#03045E', 's': '#CAF0F8', 't': '#48CAE4',
        'u': '#0096C7', 'v': '#023E8A', 'w': '#00B4D8', 'x': '#90E0EF',
        'y': '#0077B6', 'z': '#03045E', ' ': '#7209B7'
    };
    return palette[char.toLowerCase()] || `hsl(${char.charCodeAt(0) * 137 % 360}, 70%, 60%)`;
};

class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
        this.id = Math.random().toString(36).substr(2, 9);
        this.color = char ? getCharColor(char) : null;
    }

    isLeaf() {
        return this.left === null && this.right === null;
    }
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this.bubbleUp();
    }

    pop() {
        if (this.size() === 0) return null;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = last;
            this.bubbleDown();
        }
        return root;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].freq <= this.heap[index].freq) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        while (true) {
            let leftChild = 2 * index + 1;
            let rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length && this.heap[leftChild].freq < this.heap[smallest].freq) {
                smallest = leftChild;
            }
            if (rightChild < this.heap.length && this.heap[rightChild].freq < this.heap[smallest].freq) {
                smallest = rightChild;
            }

            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    size() {
        return this.heap.length;
    }

    clone() {
        const newHeap = new MinHeap();
        newHeap.heap = [...this.heap];
        return newHeap;
    }
}

export const generateSimulationSteps = (text) => {
    if (!text) return [];
    const steps = [];
    const charColors = {};

    // Stage 1: Frequency Map
    const freqMap = {};
    for (let char of text) {
        freqMap[char] = (freqMap[char] || 0) + 1;
        if (!charColors[char]) charColors[char] = getCharColor(char);
    }

    steps.push({
        stage: 'FREQUENCY_MAP',
        freqMap,
        charColors,
        description: 'First, we count the frequency of each character in the text.'
    });

    // Stage 2: Initial Forest
    const heap = new MinHeap();
    Object.entries(freqMap).forEach(([char, freq]) => {
        heap.push(new HuffmanNode(char, freq));
    });

    steps.push({
        stage: 'INITIAL_FOREST',
        heap: [...heap.heap],
        charColors,
        description: 'We create a leaf node for each character and add them to a min-priority queue (min-heap).'
    });

    // Stage 3: Merge Nodes
    while (heap.size() > 1) {
        const node1 = heap.pop();
        const node2 = heap.pop();

        steps.push({
            stage: 'SELECT_MIN',
            heap: [...heap.heap, node1, node2],
            activeNodes: [node1.id, node2.id],
            charColors,
            description: `Extract the two nodes with the lowest frequencies: "${node1.char || 'internal'}" (${node1.freq}) and "${node2.char || 'internal'}" (${node2.freq}).`
        });

        const parent = new HuffmanNode(null, node1.freq + node2.freq, node1, node2);
        heap.push(parent);

        steps.push({
            stage: 'MERGE_NODES',
            heap: [...heap.heap],
            activeNodes: [parent.id],
            charColors,
            description: `Merge them into a new internal node with frequency ${parent.freq}. -> internal node(${parent.freq})`
        });
    }

    const root = heap.pop();
    steps.push({
        stage: 'TREE_COMPLETE',
        root,
        heap: [root],
        charColors,
        description: 'Huffman tree construction complete.'
    });

    // Stage 4: Assign Codes (DFS)
    const codes = {};
    const dfsSteps = [];
    const traverse = (node, code = "") => {
        if (!node) return;
        
        if (node.isLeaf()) {
            codes[node.char] = code;
            dfsSteps.push({
                stage: 'ASSIGN_CODES',
                root,
                activeNodes: [node.id],
                codes: { ...codes },
                charColors,
                description: `Assigned code "${code}" to character "${node.char}".`
            });
        } else {
            traverse(node.left, code + "0");
            traverse(node.right, code + "1");
        }
    };

    traverse(root);
    steps.push(...dfsSteps);

    // Final Stage: Result
    const encodedText = text.split('').map(char => codes[char]).join('');
    const originalSize = text.length * 8;
    const compressedSize = encodedText.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    steps.push({
        stage: 'RESULT',
        root,
        codes,
        encodedText,
        charColors,
        stats: {
            originalSize,
            compressedSize,
            compressionRatio
        },
        description: 'Compression complete! View the final statistics and bit stream.'
    });

    return steps;
};
