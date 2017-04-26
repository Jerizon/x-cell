const {
    removeChildren,
    createTH,
    createTR,
    createTD
} = require('../dom-util');

describe('dom-util', () => {
    describe('removeChildren()', () => {
        it('removes one child', () => {
            //set up intial state
            const parent = document.createElement('DIV');
            const child = document.createElement('STRONG');
            parent.appendChild(child);

            //inspect inital state
            expect(parent.childNodes.length).toBe(1);
            expect(parent.childNodes[0]).toBe(child)
                // execute code under test
            removeChildren(parent);

            // inspect resulting state
            expect(parent.childNodes.length).toBe(0);
        });
    });

    describe('DOM creation functions', () => {
        describe('createTH', () => {
            it('produces valid TH element', () => {
                const el = createTH();
                expect(el.tagName).toBe('TH');
            })
            it('sets the text of the TH', () => {
            	const text = 'Oh thist\'s just greate! Well, game over, man!';
            	const el = createTH(text);
            	expect(el.textContent).toEqual(text);
            })
        });
        describe('createTD', () => {
            it('produces valid TD element', () => {
                const el = createTD();
                expect(el.tagName).toBe('TD');
            });
        });
        describe('createTR', () => {
            it('produces valid TR element', () => {
                const el = createTR();
                expect(el.tagName).toBe('TR');
            })
        });
    });
});
