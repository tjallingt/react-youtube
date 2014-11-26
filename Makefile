BIN = node_modules/.bin

setup:
	npm install

test:
	$(BIN)/jest

serve:
	$(BIN)/http-server ./example -s

example/bundle.js: example/example.js
	$(BIN)/watchify $^ -o $@

example/bundle.css: example/example.css
	$(BIN)/autoprefixer $^ -o $@

clean:
	rm -rf node_modules
	rm example/bundle.*

.PHONT: setup test serve clean