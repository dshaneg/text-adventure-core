.PHONY: build publish \
		set-executable deps \
		clean deep-clean

build: set-executable create-target
	bin/build.sh

publish: set-executable
	bin/publish.sh

set-executable:
	chmod -c +x bin/*.sh

deps:
	yarn install

create-target:
	mkdir -p target/test-results/unit-tests
	mkdir -p target/test-results/smoke-tests
	mkdir -p target/dist

clean:
	rm -rf target
	rm -rf .nyc_output
	rm -f yarn*.log
	rm -f test-results.xml

deep-clean: clean
	rm -rf node_modules
