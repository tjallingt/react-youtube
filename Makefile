BIN = node_modules/.bin

setup:
	npm install
	mkdir example/build

test:
	$(BIN)/jest

example: example/build/bundle.js example/build/bundle.css

example/build/bundle.js: example/example.js
	$(BIN)/browserify $^ -o $@

example/build/bundle.css: example/example.css
	$(BIN)/autoprefixer $^ -o $@

clean:
	rm -rf node_modules example/build

.PHONY: setup test example clean
